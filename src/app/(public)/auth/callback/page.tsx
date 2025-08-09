"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message, Spin } from "antd";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/");
    } else {
      message.error("Authentication failed");
      router.replace("/auth/login?oauth=failed");
    }
  }, [params, router]);
  return null;
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] grid place-items-center">
          <Spin size="large" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
