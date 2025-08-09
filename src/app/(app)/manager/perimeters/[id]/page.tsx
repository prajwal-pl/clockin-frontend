"use client";
import { useEffect, useState } from "react";
import { Card, Skeleton, message } from "antd";
import { PerimeterAPI, type Perimeter } from "@/lib/api";
import { RequireManager } from "@/lib/auth";
import PerimeterEditor from "@/components/PerimeterEditor";
import { useParams } from "next/navigation";

export default function EditPerimeterPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<Perimeter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    PerimeterAPI.get(id)
      .then(setData)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Failed to load";
        message.error(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const save = async (payload: Perimeter) => {
    try {
      setSaving(true);
      await PerimeterAPI.update(id, payload);
      message.success("Saved");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      message.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton active />;
  if (!data) return null;

  return (
    <RequireManager>
      <Card className="shadow-sm">
        <PerimeterEditor initial={data} onSubmit={save} submitting={saving} />
      </Card>
    </RequireManager>
  );
}
