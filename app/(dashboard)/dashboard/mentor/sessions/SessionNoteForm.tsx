"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  sessionId: number;
  existingNotes: string | null;
  existingPlan: string | null;
}

export default function SessionNoteForm({ sessionId, existingNotes, existingPlan }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(!existingNotes);
  const [notes, setNotes] = useState(existingNotes || "");
  const [plan, setPlan] = useState(existingPlan || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/mentor/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId, sessionNotes: notes, nextSessionPlan: plan }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.refresh();
    }, 1000);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "0.4rem 0.75rem",
          background: "none",
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          color: "#666",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        Edit notes
      </button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label style={{ display: "block", color: "#666", fontSize: "0.75rem", marginBottom: "0.3rem" }}>
          Session Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What was covered? How did the student do?"
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#ddd",
            fontSize: "0.875rem",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div>
        <label style={{ display: "block", color: "#666", fontSize: "0.75rem", marginBottom: "0.3rem" }}>
          Next Session Plan
        </label>
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          rows={2}
          placeholder="What will you cover next time?"
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#ddd",
            fontSize: "0.875rem",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "0.5rem 1rem",
            background: saved ? "#1a3a1a" : "linear-gradient(135deg, #d4a843, #f0c060)",
            border: "none",
            borderRadius: "8px",
            color: saved ? "#4caf7d" : "#000",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saved ? "Saved ✓" : saving ? "Saving…" : "Save Notes"}
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            padding: "0.5rem 0.75rem",
            background: "none",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#666",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
