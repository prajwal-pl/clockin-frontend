"use client";
import { Layout, Menu, Typography, Button, Flex } from "antd";
import Link from "next/link";
import { Clock, LayoutDashboard, Map } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const menuItems = [
    {
      key: "clock",
      label: (
        <Link href="/worker/clock">
          <span
            style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
          >
            <Clock size={16} /> Clock
          </span>
        </Link>
      ),
    },
    isManager
      ? {
          key: "dashboard",
          label: (
            <Link href="/manager/dashboard">
              <span
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <LayoutDashboard size={16} /> Dashboard
              </span>
            </Link>
          ),
        }
      : null,
    isManager
      ? {
          key: "perimeters",
          label: (
            <Link href="/manager/perimeters">
              <span
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <Map size={16} /> Perimeters
              </span>
            </Link>
          ),
        }
      : null,
    isManager
      ? {
          key: "reports",
          label: (
            <Link href="/manager/reports">
              <span
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <LayoutDashboard size={16} /> Reports
              </span>
            </Link>
          ),
        }
      : null,
  ].filter(Boolean) as { key: string; label: React.ReactNode }[];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          paddingInline: 16,
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center gap-4">
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            Worker Clock-in
          </Typography.Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            style={{ flex: 1, flexWrap: "wrap" }}
            items={menuItems as any}
          />
          <Flex align="center" gap={8}>
            <Link href="/account" className="text-white/90 text-sm">
              {user?.name || user?.email}
            </Link>
            <Button
              size="small"
              onClick={() => {
                logout();
                location.href = "/auth/login";
              }}
            >
              Logout
            </Button>
          </Flex>
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: 16 }}>
        <div className="mx-auto w-full max-w-[1100px] p-2">{children}</div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        <span className="text-gray-500">
          © {new Date().getFullYear()} Worker Clock-in
        </span>
      </Layout.Footer>
    </Layout>
  );
}
