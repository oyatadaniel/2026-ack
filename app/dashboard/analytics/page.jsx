import Script from "next/script";

export const metadata = {
  title: "ACK Diocese of Maseno North",
  description:
    "Official website of the ACK Diocese of Maseno North — Maseno, Kisumu County, Kenya.",
};

export default function RootLayout({ children }) {
  return (
    <>
      {children}

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
    </>
  );
}
