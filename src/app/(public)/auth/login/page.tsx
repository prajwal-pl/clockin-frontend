"use client";
import { Button, Card, Flex, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { AuthAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogIn, Chrome, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values);
      message.success("Logged in");
      router.push("/worker/clock");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      message.error(msg);
    }
  };

  return (
    <Flex vertical align="center" className="w-full">
      <Flex vertical gap={12} className="w-full max-w-[440px]">
        <Typography.Title
          level={2}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 0,
          }}
        >
          <LogIn size={20} /> Sign in
        </Typography.Title>
        <Card
          style={{ width: "100%" }}
          styles={{ body: { padding: 20, minHeight: 360 } }}
          className="shadow-md"
        >
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                placeholder="you@example.com"
                prefix={<Mail size={16} />}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="••••••••"
                prefix={<Lock size={16} />}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                icon={<LogIn size={16} />}
              >
                Sign in
              </Button>
            </Form.Item>
            <Button
              block
              href={AuthAPI.googleUrl()}
              size="large"
              icon={<Chrome size={16} />}
            >
              Continue with Google
            </Button>
            <Flex style={{ marginTop: 12 }} justify="center">
              <Typography.Text>
                No account? <Link href="/auth/register">Create one</Link>
              </Typography.Text>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
}
