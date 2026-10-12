"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  Newspaper,
  BookOpen,
  Crown,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  Heart,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

/* ---------------- Mock data (replace with real fetches) ---------------- */

const STATS = [
  {
    label: "Total Members",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    href: "/admin/members",
  },
  {
    label: "Upcoming Events",
    value: "8",
    change: "+2",
    trend: "up",
    icon: CalendarDays,
    href: "/admin/events",
  },
  {
    label: "Sermons Published",
    value: "156",
    change: "+4 this month",
    trend: "up",
    icon: Newspaper,
    href: "/admin/news",
  },
  {
    label: "New Visitors",
    value: "73",
    change: "-3.2%",
    trend: "down",
    icon: UserPlus,
    href: "/admin/members",
  },
];

const WEEKLY_ATTENDANCE = [
  { day: "Sun", value: 420 },
  { day: "Mon", value: 85 },
  { day: "Tue", value: 110 },
  { day: "Wed", value: 260 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 140 },
  { day: "Sat", value: 180 },
];

const MONTHLY_GIVING = [
  { month: "May", value: 42 },
  { month: "Jun", value: 51 },
  { month: "Jul", value: 48 },
  { month: "Aug", value: 63 },
  { month: "Sep", value: 58 },
  { month: "Oct", value: 71 },
];

const UPCOMING_EVENTS = [
  {
    title: "Sunday Worship Service",
    date: "Oct 12",
    time: "9:00 AM",
    location: "Main Sanctuary",
    tag: "Worship",
  },
  {
    title: "Youth Bible Study",
    date: "Oct 15",
    time: "6:30 PM",
    location: "Fellowship Hall",
    tag: "Youth",
  },
  {
    title: "Community Outreach",
    date: "Oct 19",
    time: "10:00 AM",
    location: "Downtown Center",
    tag: "Outreach",
  },
  {
    title: "Choir Rehearsal",
    date: "Oct 22",
    time: "7:00 PM",
    location: "Music Room",
    tag: "Music",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: UserPlus,
    text: "Grace Wanjiru joined as a new member",
    time: "12 min ago",
    color: "text-emerald-500",
  },
  {
    icon: Heart,
    text: "Tithe donation of KES 15,000 received",
    time: "1 hr ago",
    color: "text-rose-500",
  },
  {
    icon: Newspaper,
    text: 'Sermon "Walking in Faith" published',
    time: "3 hrs ago",
    color: "text-indigo-500",
  },
  {
    icon: MessageSquare,
    text: "New prayer request submitted",
    time: "5 hrs ago",
    color: "text-amber-500",
  },
  {
    icon: Crown,
    text: "Bishop profile updated",
    time: "Yesterday",
    color: "text-purple-500",
  },
];

const TOP_SERMONS = [
  { title: "Walking in Faith", views: 1842, series: "Faith Foundations" },
  { title: "The Power of Prayer", views: 1520, series: "Prayer Life" },
  { title: "Grace Upon Grace", views: 1310, series: "Ephesians" },
  { title: "Hope in Hard Times", views: 987, series: "Psalms" },
];

/* ---------------- Helper components ---------------- */

function StatCard({ stat }) {
  const Icon = stat.icon;
  const isUp = stat.trend === "up";

  return (
    <Link
      href={stat.href}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 hover:border-[#4c1d95]/40 dark:hover:border-[#a78bfa]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-7 h-7 flex-shrink-0 rounded-md bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 flex items-center justify-center">
          <Icon size={14} className="text-[#4c1d95] dark:text-[#a78bfa]" />
        </div>

        {/* Label + change */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
            {stat.label}
          </p>
          <div
            className={`inline-flex items-center gap-0.5 text-[10px] font-medium mt-0.5 ${
              isUp
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {stat.change}
          </div>
        </div>

        {/* Value on the right */}
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex-shrink-0">
          {stat.value}
        </p>

        {/* Arrow indicator */}
        <ArrowUpRight
          size={12}
          className="text-gray-300 dark:text-gray-600 group-hover:text-[#4c1d95] dark:group-hover:text-[#a78bfa] transition flex-shrink-0"
        />
      </div>
    </Link>
  );
}

function BarChart({ data, max, labelKey, valueKey, suffix = "" }) {
  return (
    <div className="flex items-end justify-between gap-2 h-36 mt-3">
      {data.map((item) => {
        const height = (item[valueKey] / max) * 100;
        return (
          <div
            key={item[labelKey]}
            className="flex-1 flex flex-col items-center gap-1.5 group"
          >
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#4c1d95] to-[#7c3aed] dark:from-[#6d28d9] dark:to-[#a78bfa] opacity-80 group-hover:opacity-100 transition-all"
                style={{ height: `${height}%` }}
              />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition">
                {item[valueKey]}
                {suffix}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {item[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

export default function AdminDashboard() {
  const maxAttendance = Math.max(...WEEKLY_ATTENDANCE.map((d) => d.value));
  const maxGiving = Math.max(...MONTHLY_GIVING.map((d) => d.value));

  return (
    <div className="px-3 space-y-2 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Welcome back, Pastor
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Here's what's happening across your church this week.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md px-2.5 py-1.5">
          <Clock size={11} />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Weekly attendance */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                Weekly Attendance
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                Total check-ins this week
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                1,290
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 justify-end">
                <TrendingUp size={10} /> +8.4%
              </p>
            </div>
          </div>
          <BarChart
            data={WEEKLY_ATTENDANCE}
            max={maxAttendance}
            labelKey="day"
            valueKey="value"
          />
        </div>

        {/* Monthly giving */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                Monthly Giving
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                Tithes & offerings (KES '000)
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                KES 333K
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 justify-end">
                <TrendingUp size={10} /> +22.4%
              </p>
            </div>
          </div>
          <BarChart
            data={MONTHLY_GIVING}
            max={maxGiving}
            labelKey="month"
            valueKey="value"
            suffix="K"
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Upcoming events */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
              Upcoming Events
            </h2>
            <Link
              href="/admin/events"
              className="text-[10px] text-[#4c1d95] dark:text-[#a78bfa] hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={10} />
            </Link>
          </div>

          <div className="space-y-0.5">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.title}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-9 h-9 flex-shrink-0 rounded-md bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-medium text-[#4c1d95] dark:text-[#a78bfa] uppercase leading-none">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-xs font-semibold text-[#4c1d95] dark:text-[#a78bfa] leading-none mt-0.5">
                    {event.date.split(" ")[1]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100 truncate">
                    {event.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} /> {event.time}
                    </span>
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin size={10} /> {event.location}
                    </span>
                  </div>
                </div>

                <span className="flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {event.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
              Recent Activity
            </h2>
            <TrendingUp size={12} className="text-gray-400" />
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon size={12} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top sermons */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
              Most Viewed Sermons
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              Top performing content this month
            </p>
          </div>
          <Link
            href="/admin/news"
            className="text-[10px] text-[#4c1d95] dark:text-[#a78bfa] hover:underline flex items-center gap-0.5"
          >
            Manage <ChevronRight size={10} />
          </Link>
        </div>

        <div className="space-y-1">
          {TOP_SERMONS.map((sermon, i) => (
            <div
              key={sermon.title}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="w-5 text-center text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100 truncate">
                  {sermon.title}
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {sermon.series}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                <Eye size={10} />
                {sermon.views.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
