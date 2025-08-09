"use client";
import Link from "next/link";
import { Map } from "lucide-react";
import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Table,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { PerimeterAPI, type Perimeter } from "@/lib/api";
import { RequireManager } from "@/lib/auth";

export default function PerimetersListPage() {
  const [items, setItems] = useState<Perimeter[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await PerimeterAPI.list();
      setItems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    try {
      await PerimeterAPI.delete(id);
      message.success("Deleted");
      load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      message.error(msg);
    }
  };

  return (
    <RequireManager>
      <Flex vertical gap={16} className="w-full">
        <Flex
          align="center"
          justify="space-between"
          className="gap-2 flex-wrap"
        >
          <Typography.Title
            level={3}
            style={{ margin: 0 }}
            className="flex items-center gap-2"
          >
            <Map size={20} /> Perimeters
          </Typography.Title>
          <Link href="/manager/perimeters/new">
            <Button type="primary">New</Button>
          </Link>
        </Flex>
        <Card className="shadow-sm">
          <Table
            rowKey={(r) => r.id!}
            loading={loading}
            dataSource={items}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Location", dataIndex: "location" },
              { title: "Radius (m)", dataIndex: "radius" },
              {
                title: "Actions",
                render: (_, r) => (
                  <Flex gap={8}>
                    <Link href={`/manager/perimeters/${r.id}`}>
                      <Button size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                      title="Delete perimeter?"
                      onConfirm={() => remove(r.id!)}
                    >
                      <Button size="small" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Flex>
                ),
              },
            ]}
          />
        </Card>
      </Flex>
    </RequireManager>
  );
}
