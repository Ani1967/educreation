import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  verification: {
    google: "O44pzGtYeq-OLUIbMgUUUe7W-14msQl1oKnGGAvdgII",
  },
  title: "EduCreation — Understand More. Stress Less. Create Always.",
  description:
    "EduCreation is a revolutionary learning system for students in India. Conceptual learning, stress-free exam preparation, and real understanding — not memorisation.",
  keywords:
    "EduCreation, learning system, conceptual learning, NCERT, CBSE, India education, Kolkata, tutoring, stress-free learning",
  openGraph: {
    title: "EduCreation — Where Curiosity Meets Craft",
    description:
      "A new way of learning everything. Not just knowledge — understanding that stays for life.",
    url: "https://www.educreators.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
