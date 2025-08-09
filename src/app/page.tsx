"use client";
import Link from "next/link";
import { Button, Card, Flex, Typography } from "antd";
import { LogIn, Map, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "MANAGER" || user.role === "ADMIN")
        router.replace("/manager/dashboard");
      else router.replace("/worker/clock");
    }
  }, [user, loading, router]);
  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <Card className="max-w-3xl w-full shadow-md">
        <Flex vertical gap={16} align="center" className="text-center">
          <Typography.Title className="!mb-1">Worker Clock-in</Typography.Title>
          <Typography.Paragraph type="secondary" className="max-w-2xl">
            Simple, reliable time tracking for on-site teams with geofenced
            clock-ins, manager dashboards, and perimeter management.
          </Typography.Paragraph>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/auth/login">
              <Button type="primary" size="large" icon={<LogIn size={16} />}>
                Sign in
              </Button>
            </Link>
            <Link href="/worker/clock">
              <Button size="large" icon={<Map size={16} />}>
                Worker Clock
              </Button>
            </Link>
            <Link href="/manager/dashboard">
              <Button size="large" icon={<LayoutDashboard size={16} />}>
                Manager Dashboard
              </Button>
            </Link>
            <Link href="/manager/perimeters">
              <Button size="large" icon={<Map size={16} />}>
                Perimeters
              </Button>
            </Link>
          </div>
        </Flex>
      </Card>
    </main>
  );
}
