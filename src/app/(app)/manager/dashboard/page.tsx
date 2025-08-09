"use client";
import {
  Card,
  Col,
  Flex,
  Row,
  Statistic,
  Table,
  Typography,
  message,
} from "antd";
import { Users, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClockAPI } from "@/lib/api";
import { RequireManager } from "@/lib/auth";

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<{
    totalActive: number;
    totalUsers: number;
    todayClockIns: number;
    todayClockOuts: number;
  } | null>(null);
  const [staff, setStaff] = useState<
    Array<{ id: string; name: string; email?: string; since: string }>
  >([]);

  useEffect(() => {
    ClockAPI.dashboard()
      .then((d) => {
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = d.avgHoursPerDay.find((x) =>
          x.date.startsWith(today)
        );
        setStats({
          totalActive: d.avgHoursPerDay.at(-1)?.peopleCount ?? 0,
          totalUsers: d.totalHoursPerStaffLastWeek.length,
          todayClockIns: todayEntry?.peopleCount ?? 0,
          todayClockOuts: Math.max(0, (todayEntry?.peopleCount ?? 0) - 0),
        });
      })
      .catch((e) => message.error(e.message));
    ClockAPI.activeStaff()
      .then((res) => setStaff(res))
      .catch((e) => message.error(e.message));
  }, []);

  return (
    <RequireManager>
      <Flex vertical gap={16} className="w-full">
        <Typography.Title level={3} className="flex items-center gap-2 !mb-1">
          <BarChart3 size={20} /> Dashboard
        </Typography.Title>
        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}>
            <Card className="h-full shadow-sm">
              <Statistic
                title="Active"
                value={stats?.totalActive ?? 0}
                prefix={<Users size={16} />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="h-full shadow-sm">
              <Statistic
                title="Users"
                value={stats?.totalUsers ?? 0}
                prefix={<Users size={16} />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="h-full shadow-sm">
              <Statistic
                title="Clock Ins (Today)"
                value={stats?.todayClockIns ?? 0}
                prefix={<Clock size={16} />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="h-full shadow-sm">
              <Statistic
                title="Clock Outs (Today)"
                value={stats?.todayClockOuts ?? 0}
                prefix={<Clock size={16} />}
              />
            </Card>
          </Col>
        </Row>
        <Card title="Active Staff" className="shadow-sm">
          <Table
            rowKey="id"
            dataSource={staff}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              { title: "Since", dataIndex: "since" },
              {
                title: "",
                render: (_, r) => (
                  <Link href={`/manager/users/${r.id}/logs`}>View logs</Link>
                ),
              },
            ]}
            pagination={false}
          />
        </Card>
      </Flex>
    </RequireManager>
  );
}
