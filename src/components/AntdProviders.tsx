"use client";
import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

export default function AntdProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setIsDark(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#3b82f6", // Tailwind blue-500
          borderRadius: 8,
          fontFamily: "var(--font-geist-sans)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
