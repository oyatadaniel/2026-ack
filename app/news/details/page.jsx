import { Suspense } from "react";
import NewsDetailsClient from "./NewsDetailsClient";

export const metadata = {
  title: "News Details",
  description:
    "Read the latest news from ACK Diocese of Maseno North — updates, announcements, and stories from across the diocese.",
};

export default function NewsDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white font-sans antialiased flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading article…</p>
        </div>
      }
    >
      <NewsDetailsClient />
    </Suspense>
  );
}
