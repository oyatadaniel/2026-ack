"use client";

import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import ChatWidget from "./components/ChatWidget";

export default function ClientLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                const d = t ? t === 'dark'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', d);
              } catch (e) {}
            `,
          }}
        />

        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ACK Diocese of Maseno North",
              url: "https://ackdioceseofmasenonorth.org",
              logo: "https://ackdioceseofmasenonorth.org/logo.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kisumu/Webuye Rd",
                addressLocality: "Kakamega",
                postalCode: "50100",
                addressCountry: "KE",
              },
            }),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 transition-colors">
        <SessionProvider>{children}</SessionProvider>
        <ChatWidget />

        <Toaster
          position="bottom-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "0.5rem",
              padding: "8px 12px",
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            },
            success: {
              iconTheme: { primary: "#4c1d95", secondary: "#ffffff" },
            },
            error: { iconTheme: { primary: "#e11d48", secondary: "#ffffff" } },
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-73GHER9LLP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-73GHER9LLP');
          `}
        </Script>
      </body>
    </html>
  );
}
