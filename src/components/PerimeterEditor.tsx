"use client";
import { useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Space,
  Typography,
  InputNumber,
} from "antd";
import { Save } from "lucide-react";
import dynamic from "next/dynamic";
import type { Perimeter } from "@/lib/api";

const LeafletClientMap = dynamic(() => import("./LeafletClientMap"), {
  ssr: false,
});

type LatLng = { lat: number; lng: number };

export default function PerimeterEditor({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Perimeter;
  onSubmit: (data: Perimeter) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [form] = Form.useForm<Perimeter>();
  const [center, setCenter] = useState<LatLng>({
    lat: initial?.latitude ?? 51.505,
    lng: initial?.longitude ?? -0.09,
  });
  const [radius, setRadius] = useState<number>(initial?.radius ?? 200);

  const submit = async () => {
    const v = await form.validateFields();
    await onSubmit({
      id: initial?.id,
      name: v.name,
      location: v.location,
      latitude: center.lat,
      longitude: center.lng,
      radius,
    });
  };

  return (
    <Flex vertical gap={16} className="w-full">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: initial?.name, location: initial?.location }}
      >
        <Form.Item
          name="name"
          label="Perimeter Name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="e.g. Office HQ" size="large" />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location (label)"
          rules={[{ required: true, message: "Please enter a location" }]}
        >
          <Input placeholder="City or site label" size="large" />
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        Click on the map to pick the center point. Adjust radius below (meters).
      </Typography.Text>
      <LeafletClientMap
        center={center}
        onPick={setCenter}
        circleRadius={radius}
      />
      <Space align="center" wrap>
        <Typography.Text>Radius (m):</Typography.Text>
        <InputNumber
          min={10}
          max={20000}
          step={10}
          value={radius}
          onChange={(v) => setRadius(Number(v) || 0)}
        />
        <Button
          type="primary"
          onClick={submit}
          loading={submitting}
          icon={<Save size={16} />}
        >
          {initial?.id ? "Save Changes" : "Create Perimeter"}
        </Button>
      </Space>
    </Flex>
  );
}
