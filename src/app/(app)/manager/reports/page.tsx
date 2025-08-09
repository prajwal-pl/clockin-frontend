"use client";
import { useEffect, useState } from "react";
import { Card, Col, Flex, Row, Table, Typography, message } from "antd";
import { ClockAPI } from "@/lib/api";
import { BarChart3 } from "lucide-react";

type Reports = {
  avgHoursPerDay: number;
  dailyClockIns: Array<{ date: string; count: number }>;
  totalsPerStaff: Array<{ id: string; name: string; totalHours: number }>;
};

export default function ReportsPage() {
  const [data, setData] = useState<Reports | null>(null);

  useEffect(() => {
    (ClockAPI as any)
      .reports?.()
      .then(setData)
      .catch((e: unknown) => {
        console.warn("Reports endpoint missing or failed", e);
        message.info("Reports data not available yet.");
      });
  }, []);

  return (
    <Flex vertical gap={16} className="w-full">
      <Typography.Title level={3} className="flex items-center gap-2 !mb-1">
        <BarChart3 size={20} /> Reports
      </Typography.Title>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={8}>
          <Card title="Avg hours per day" className="shadow-sm">
            <Typography.Title level={2} className="!m-0">
              {data?.avgHoursPerDay?.toFixed?.(2) ?? "—"}
            </Typography.Title>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            title="People clocking in each day (last 7)"
            bodyStyle={{ paddingTop: 8 }}
            className="shadow-sm"
          >
            <div className="grid grid-cols-7 gap-2">
              {(data?.dailyClockIns ?? []).map((d) => (
                <div key={d.date} className="text-center">
                  <div className="text-xs text-gray-500">
                    {new Date(d.date).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-medium">{d.count}</div>
                </div>
              ))}
              {!data?.dailyClockIns && (
                <div className="text-gray-500">No data</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Card title="Total hours per staff (last 7 days)" className="shadow-sm">
        <Table
          size="small"
          rowKey="id"
          dataSource={data?.totalsPerStaff ?? []}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Total Hours", dataIndex: "totalHours" },
          ]}
        />
      </Card>
    </Flex>
  );
}
