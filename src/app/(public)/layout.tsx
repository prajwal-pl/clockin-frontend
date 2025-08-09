"use client";
import { Layout, Typography } from "antd";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ display: "flex", alignItems: "center" }}>
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          Worker Clock-in
        </Typography.Title>
      </Layout.Header>
      <Layout.Content className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
        <div className="w-full max-w-[520px]">{children}</div>
      </Layout.Content>
    </Layout>
  );
}
