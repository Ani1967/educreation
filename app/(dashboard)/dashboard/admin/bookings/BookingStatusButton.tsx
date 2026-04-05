"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: number;
  currentStatus: string;
  nextStatus: string;
  nextLabel: string;
}

export default function BookingStatusButton({ id, nextStatus, nextLabel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function advance() {
    setLoading(true);
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      style={{
        padding: "0.5rem 0.9rem",
        background: loading ? "#1a1a1a" : "#1a1a2a",
        border: "1px solid #2a2a4a",
        borderRadius: "8px",
        color: loading ? "#555" : "#8899ff",
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "Saving…" : nextLabel}
    </button>
  );
}
