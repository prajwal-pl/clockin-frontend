"use client";
import { Card, Typography, Descriptions, Button, message } from "antd";
import { useAuth } from "@/lib/auth";
import { AuthAPI } from "@/lib/api";

export default function AccountPage() {
  const { user, refresh } = useAuth();
  const promote = async () => {
    if (!user) return;
    try {
      await AuthAPI.updateRole(user.id, "MANAGER");
      message.success("Role updated to MANAGER");
      await refresh();
    } catch (e: any) {
      message.error(e?.message || "Failed to update role");
    }
  };

  return (
    <Card className="max-w-xl">
      <Typography.Title level={3} className="!mb-3">
        Account
      </Typography.Title>
      <Descriptions
        bordered
        size="small"
        column={1}
        items={[
          { key: "name", label: "Name", children: user?.name || "-" },
          { key: "email", label: "Email", children: user?.email || "-" },
          { key: "role", label: "Role", children: user?.role || "-" },
        ]}
      />
      <div className="mt-4 flex gap-2">
        <Button
          type="primary"
          onClick={promote}
          disabled={!user || user.role === "MANAGER" || user.role === "ADMIN"}
        >
          Become Manager
        </Button>
      </div>
    </Card>
  );
}
