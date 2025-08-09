"use client";
import { useState } from "react";
import { Card, message } from "antd";
import { PerimeterAPI, type Perimeter } from "@/lib/api";
import { RequireManager } from "@/lib/auth";
import PerimeterEditor from "@/components/PerimeterEditor";
import { useRouter } from "next/navigation";

export default function NewPerimeterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const save = async (data: Perimeter) => {
    setLoading(true);
    try {
      const p = await PerimeterAPI.create(data);
      message.success("Perimeter created");
      router.push(`/manager/perimeters/${p.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Create failed";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireManager>
      <Card className="shadow-sm">
        <PerimeterEditor onSubmit={save} submitting={loading} />
      </Card>
    </RequireManager>
  );
}
