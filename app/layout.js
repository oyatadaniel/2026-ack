import ClientLayout from "./ClientLayout";

export const metadata = {
  metadataBase: new URL("https://ackdioceseofmasenonorth.org"),

  title: {
    default: "ACK Diocese of Maseno North",
    template: "%s | ACK Diocese of Maseno North",
  },
  description:
    "The Anglican Church of Kenya, Diocese of Maseno North — an empowered, sustainable and mission-oriented diocese boldly proclaiming Christ across Vihiga, Kakamega, Siaya and Bungoma Counties.",

  keywords: [
    "ACK Diocese of Maseno North",
    "Anglican Church of Kenya",
    "Maseno North",
    "ACK Maseno",
    "Diocese of Maseno North",
    "Anglican Diocese Kenya",
    "Kakamega Anglican Church",
    "Vihiga Anglican Church",
    "ACK Kakamega",
    "ACK Vihiga",
    "Anglican Church Western Kenya",
    "Bishop Charles Asilutwa",
  ],

  authors: [{ name: "ACK Diocese of Maseno North" }],
  creator: "ACK Diocese of Maseno North",
  publisher: "ACK Diocese of Maseno North",
  applicationName: "ACK Diocese of Maseno North",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://ackdioceseofmasenonorth.org",
    siteName: "ACK Diocese of Maseno North",
    title: "ACK Diocese of Maseno North",
    description:
      "An empowered, sustainable and mission-oriented diocese boldly proclaiming Christ across western Kenya.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACK Diocese of Maseno North",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ACK Diocese of Maseno North",
    description:
      "An empowered, sustainable and mission-oriented diocese boldly proclaiming Christ across western Kenya.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "religion",

  verification: {
    google: "00eb1a5436722a94",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
