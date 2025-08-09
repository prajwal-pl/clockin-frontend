import axios from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Inject Authorization token when present
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Role = "MANAGER" | "CARE_WORKER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
};

// Circle-based perimeter model matching backend
export type Perimeter = {
  id?: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
};

export type ActiveStaffItem = {
  id: string;
  name: string;
  email?: string;
  since: string;
};

export type DashboardRange = { from: string; to: string };
export type DashboardBackend = {
  range: { from: string; to: string };
  avgHoursPerDay: Array<{
    date: string;
    avgHours: number;
    peopleCount: number;
  }>;
  totalHoursPerStaffLastWeek: Array<{ userId: string; hours: number }>;
};

export const AuthAPI = {
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const r = await http.post("/auth/register", data);
    const { user, token } = r.data;
    return { user, token };
  },
  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const r = await http.post("/auth/login", data);
    const { user, token } = r.data;
    return { user, token };
  },
  async me(): Promise<User> {
    const r = await http.get("/auth/me");
    return r.data.user as User;
  },
  async updateRole(userId: string, role: Role): Promise<User> {
    const r = await http.put("/auth/update-role", { userId, role });
    return r.data.user as User;
  },
  logout(): void {
    // Token-based auth: clear token client-side
    if (typeof window !== "undefined") localStorage.removeItem("token");
  },
  googleUrl() {
    return `${API_BASE}/auth/google`;
  },
};

export const ClockAPI = {
  async clockIn(data: {
    lat: number;
    lng: number;
    note?: string;
  }): Promise<void> {
    await http.post("/clock/clock-in", {
      latitude: data.lat,
      longitude: data.lng,
      note: data.note,
    });
  },
  async clockOut(data: {
    lat: number;
    lng: number;
    note?: string;
  }): Promise<void> {
    await http.post("/clock/clock-out", {
      latitude: data.lat,
      longitude: data.lng,
      note: data.note,
    });
  },
  async activeStaff(): Promise<ActiveStaffItem[]> {
    const r = await http.get("/clock/active-staff");
    const arr = (r.data.active || []) as Array<{
      clockInAt: string;
      user: { id: string; name: string | null; email?: string | null };
    }>;
    return arr.map((x) => ({
      id: x.user.id,
      name: x.user.name || "Unnamed",
      email: x.user.email || undefined,
      since: x.clockInAt,
    }));
  },
  async userLogs(
    userId: string
  ): Promise<Array<{ id: string; type: string; timestamp: string }>> {
    const r = await http.get(`/clock/user/${userId}/logs`);
    const records = (r.data.records || []) as Array<{
      id: string;
      clockInAt: string;
      clockOutAt?: string | null;
    }>;
    const out: Array<{ id: string; type: string; timestamp: string }> = [];
    for (const rec of records) {
      out.push({ id: `${rec.id}-in`, type: "IN", timestamp: rec.clockInAt });
      if (rec.clockOutAt)
        out.push({
          id: `${rec.id}-out`,
          type: "OUT",
          timestamp: rec.clockOutAt,
        });
    }
    return out.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },
  async dashboard(): Promise<DashboardBackend> {
    const r = await http.get("/clock/dashboard");
    return r.data as DashboardBackend;
  },
};

export const PerimeterAPI = {
  async list(): Promise<Perimeter[]> {
    const r = await http.get("/perimeters");
    const arr = (r.data.perimeters || []) as Array<any>;
    return arr.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      radius: p.radius,
    }));
  },
  async get(id: string): Promise<Perimeter> {
    const r = await http.get(`/perimeters/${id}`);
    const p = r.data.perimeter;
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      radius: p.radius,
    };
  },
  async create(data: Omit<Perimeter, "id">): Promise<Perimeter> {
    const r = await http.post("/perimeters", {
      name: data.name,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      radiusMeters: data.radius,
    });
    const p = r.data.perimeter;
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      radius: p.radius,
    };
  },
  async update(id: string, data: Partial<Perimeter>): Promise<Perimeter> {
    const r = await http.put(`/perimeters/${id}`, {
      name: data.name,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      radiusMeters: data.radius,
    });
    const p = r.data.perimeter;
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      radius: p.radius,
    };
  },
  async delete(id: string): Promise<void> {
    await http.delete(`/perimeters/${id}`);
  },
  async checkWithin(
    lat: number,
    lng: number
  ): Promise<{
    inside: boolean;
    nearest?: {
      id: string;
      name: string;
      distanceMeters: number;
      radiusMeters: number;
    } | null;
  }> {
    const r = await http.get("/perimeters/check/within", {
      params: { latitude: lat, longitude: lng },
    });
    return r.data;
  },
};
