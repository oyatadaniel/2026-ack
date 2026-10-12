"use client";

import { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

export default function AdminLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden">
      {/* Full-width header — fixed height, never scrolls */}
      <Header
        onMenuClick={() => setMobileNavOpen((o) => !o)}
        mobileNavOpen={mobileNavOpen}
      />

      {/* Row: side nav + main, sitting BELOW the header */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — desktop always visible, mobile as overlay */}
        <SideNav
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        {/* Main content — scrolls independently of the sidebar */}
        <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full ">{children}</div>
        </main>
      </div>
    </div>
  );
}
