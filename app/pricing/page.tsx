import { auth } from "@/auth";
import PricingClient from "./PricingClient";

const PLANS = [
  { key: "free-pdf", name: "Free Guide", priceMonthly: "₹0", priceYearly: "₹0", subMonthly: "Instant PDF", subYearly: "Instant PDF", color: "#22c55e", features: ["Personalised 4-step concept guide","Enter child's class + topic + problem","Easy steps parents can follow at home","No commitment - try first"] },
  { key: "spark", name: "Spark", priceMonthly: "₹1,999", priceYearly: "₹19,999", subMonthly: "2 sessions/week · ₹19,999/yr save ₹3,989", subYearly: "Save ₹3,989 · ₹1,666/mo billed yearly", color: "#5b8dee", features: ["2 personalised sessions per week","Core concept coverage","Session notes shared with parents","Weekly progress report"] },
  { key: "illuminate", name: "Illuminate", priceMonthly: "₹2,999", priceYearly: "₹29,999", subMonthly: "4 sessions/week · ₹29,999/yr save ₹5,989", subYearly: "Save ₹5,989 · ₹2,499/mo billed yearly", color: "#d4a843", popular: true, features: ["4 personalised sessions per week","Deep concept + problem-solving focus","Session notes + next-session plan","Weekly progress report with mentor note","Concept block tracker"] },
  { key: "mastery", name: "Mastery", priceMonthly: "₹4,999", priceYearly: "₹49,999", subMonthly: "Daily sessions · ₹49,999/yr save ₹9,989", subYearly: "Save ₹9,989 · ₹4,166/mo billed yearly", color: "#c084fc", features: ["Daily personalised sessions","Full exam preparation coverage","Priority mentor availability","Detailed weekly report + parent call","Concept mastery tracking","Mock test analysis"] },
];

export default async function PricingPage() {
  const session = await auth();
  return <PricingClient isLoggedIn={!!session} plans={PLANS} />;
}
