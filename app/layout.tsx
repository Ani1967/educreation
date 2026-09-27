import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
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
      <body>
        {children}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.' + 'facebook.net/en_US/fbevents.js');
            fbq('init', '1438654674832607');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}
