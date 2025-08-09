"use client";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { ClockAPI, PerimeterAPI } from "@/lib/api";
import { MapPin, LogIn, LogOut } from "lucide-react";
import { Alert, Input } from "antd";

const LeafletClientMap = dynamic(
  () => import("@/components/LeafletClientMap"),
  {
    ssr: false,
  }
);

type LatLng = { lat: number; lng: number };

export default function WorkerClockPage() {
  const [pos, setPos] = useState<LatLng | null>(null);
  const [within, setWithin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => message.warning("Unable to access location"),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    const check = async () => {
      if (!pos) return;
      setChecking(true);
      try {
        const res = await PerimeterAPI.checkWithin(pos.lat, pos.lng);
        setWithin(res.inside ?? null);
      } catch {
        setWithin(null);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [pos?.lat, pos?.lng]);

  const clock = async (type: "in" | "out") => {
    try {
      if (!pos) throw new Error("No location yet");
      if (type === "in")
        await ClockAPI.clockIn({ ...pos, note: note || undefined });
      else await ClockAPI.clockOut({ ...pos, note: note || undefined });
      message.success(`Clocked ${type}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Clock failed";
      message.error(msg);
    }
  };

  return (
    <Flex
      vertical
      gap={16}
      className="w-full max-w-[900px] mx-auto px-3 sm:px-0"
    >
      <Typography.Title
        level={3}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <MapPin size={20} /> Your location
      </Typography.Title>
      <Card
        bodyStyle={{ padding: 0 }}
        className="rounded-md overflow-hidden shadow-sm"
      >
        <LeafletClientMap
          center={pos ?? { lat: 51.505, lng: -0.09 }}
          marker={pos ?? undefined}
        />
      </Card>
      {within === false && (
        <Alert
          type="warning"
          showIcon
          message="You're outside the allowed perimeter. Clock in is disabled."
        />
      )}
      <Input.TextArea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note for your clock action (e.g., 'Arrived at client site')"
      />
      <Space wrap>
        <Button
          type="primary"
          size="large"
          onClick={() => clock("in")}
          disabled={!pos || within === false || checking}
          loading={checking}
          icon={<LogIn size={16} />}
        >
          Clock In
        </Button>
        <Button
          danger
          size="large"
          onClick={() => clock("out")}
          disabled={!pos}
          icon={<LogOut size={16} />}
        >
          Clock Out
        </Button>
      </Space>
      <Descriptions
        bordered
        size="small"
        items={[
          { key: "lat", label: "Lat", children: pos?.lat ?? "-" },
          { key: "lng", label: "Lng", children: pos?.lng ?? "-" },
          {
            key: "within",
            label: "Within Perimeter",
            children: within === null ? "—" : within ? "Yes" : "No",
          },
        ]}
      />
    </Flex>
  );
}
