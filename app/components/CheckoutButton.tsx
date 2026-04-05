"use client";

import { useState } from "react";

interface Props {
  plan: "spark" | "illuminate" | "mastery";
  label: string;
  price: string;
  isLoggedIn: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutButton({ plan, label, price, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleCheckout() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    // Create order on server
    const res = await fetch("/api/razorpay/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const order = await res.json();

    if (!res.ok) {
      alert(order.error || "Failed to create order.");
      setLoading(false);
      return;
    }

    // Open Razorpay checkout
    const rzp = new window.Razorpay({
      key:         order.keyId,
      amount:      order.amount,
      currency:    order.currency,
      name:        order.name,
      description: order.description,
      order_id:    order.orderId,
      prefill:     order.prefill,
      theme:       { color: "#d4a843" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        // Verify payment on server
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, plan }),
        });

        const verifyData = await verifyRes.json();
        setLoading(false);

        if (verifyData.success) {
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/dashboard/student";
          }, 2000);
        } else {
          alert("Payment verification failed. Please contact support.");
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });

    rzp.open();
  }

  if (success) {
    return (
      <div style={{
        width: "100%",
        padding: "0.85rem",
        background: "#1a3a1a",
        border: "1px solid #4caf7d",
        borderRadius: "10px",
        color: "#4caf7d",
        fontWeight: 700,
        fontSize: "0.95rem",
        textAlign: "center",
      }}>
        Payment Successful! Redirecting…
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        width: "100%",
        padding: "0.85rem",
        background: loading ? "#333" : "linear-gradient(135deg, #d4a843, #f0c060)",
        border: "none",
        borderRadius: "10px",
        color: loading ? "#888" : "#000",
        fontWeight: 700,
        fontSize: "0.95rem",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "opacity 0.2s",
      }}
    >
      {loading ? "Loading…" : isLoggedIn ? `Subscribe — ${price}/mo` : `Get Started — ${price}/mo`}
    </button>
  );
}
