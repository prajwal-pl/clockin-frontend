"use client";
import { Button, Card, Flex, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { AuthAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const { register: registerAction } = useAuth();
  const router = useRouter();

  const onFinish = async (values: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      await registerAction(values as any);
      message.success("Account created");
      router.push("/worker/clock");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
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
          <UserPlus size={20} /> Create account
        </Typography.Title>
        <Card
          style={{ width: "100%" }}
          styles={{ body: { padding: 20, minHeight: 380 } }}
          className="shadow-md"
        >
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <Input
                placeholder="Your name"
                prefix={<User size={16} />}
                size="large"
              />
            </Form.Item>
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
              rules={[{ required: true, min: 6 }]}
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
                icon={<UserPlus size={16} />}
              >
                Create account
              </Button>
            </Form.Item>
            <Flex justify="center">
              <Typography.Text>
                Already have an account? <Link href="/auth/login">Sign in</Link>
              </Typography.Text>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
}
