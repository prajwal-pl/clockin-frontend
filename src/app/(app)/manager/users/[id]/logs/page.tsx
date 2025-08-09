"use client";
import { useEffect, useState } from "react";
import { Card, Table, Typography, message } from "antd";
import { ClockAPI } from "@/lib/api";
import { useParams } from "next/navigation";

export default function UserLogsPage() {
  const params = useParams();
  const userId = params?.id as string;
  const [logs, setLogs] = useState<
    Array<{ id: string; type: string; timestamp: string }>
  >([]);

  useEffect(() => {
    if (!userId) return;
    ClockAPI.userLogs(userId)
      .then(setLogs)
      .catch((e) => message.error(e.message));
  }, [userId]);

  return (
    <Card className="shadow-sm">
      <Typography.Title level={3} className="!mb-3">
        User Logs
      </Typography.Title>
      <Table
        rowKey="id"
        dataSource={logs}
        columns={[
          { title: "Type", dataIndex: "type" },
          { title: "Timestamp", dataIndex: "timestamp" },
        ]}
      />
    </Card>
  );
}
