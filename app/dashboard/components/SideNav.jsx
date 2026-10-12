"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Newspaper,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
  Crown,
  SlidersHorizontal,
  MessageSquare,
  TrendingUp,
  Building2,
  UserCog,
  Handshake,
  Mailbox,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/events", label: "Events & Programs", icon: CalendarDays },
  { href: "/dashboard/news", label: "News & Sermons", icon: Newspaper },
  { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
  { href: "/dashboard/bishops", label: "Bishops", icon: Crown },
  {
    href: "/dashboard/archdeaconries",
    label: "Archdeaconries",
    icon: Handshake,
  },
  { href: "/dashboard/sliders", label: "Sliders", icon: SlidersHorizontal },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/mailbox", label: "Mailbox", icon: Mailbox },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/offices", label: "Offices", icon: Building2 },
  { href: "/dashboard/users", label: "Users", icon: UserCog },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function SideNav({ mobileOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const NavList = (
    <nav className="flex-1 min-h-0 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xs  transition-colors ${
              active
                ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#4c1d95] dark:hover:text-[#a78bfa]"
            }`}
          >
            <Icon
              size={14}
              className={
                active
                  ? "text-white"
                  : "text-gray-400 dark:text-gray-500 group-hover:text-[#4c1d95] dark:group-hover:text-[#a78bfa] transition-colors"
              }
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const Footer = (
    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
      <ShieldCheck size={14} />
      <span className="truncate">Authorized personnel only</span>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors overflow-hidden">
        {NavList}
        {Footer}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-16 bottom-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 overflow-hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {NavList}
        {Footer}
      </aside>
    </>
  );
}
