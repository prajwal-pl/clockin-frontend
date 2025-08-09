"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message, Spin } from "antd";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Route by role will happen from home redirect or app layout.
      router.replace("/");
    } else {
      message.error("Authentication failed");
      router.replace("/auth/login?oauth=failed");
    }
  }, [params, router]);

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Spin size="large" />
    </div>
  );
}
