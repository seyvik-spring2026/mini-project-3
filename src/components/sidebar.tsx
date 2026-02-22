"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  KanbanSquare,
  Settings,
  Search,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isRunning, setIsRunning] = useState(false);

  async function handleRunSearch() {
    setIsRunning(true);
    try {
      const res = await fetch("/api/search/queries");
      const queries = await res.json();
      const activeQuery = queries.find((q: { isActive: boolean }) => q.isActive);
      if (activeQuery) {
        await fetch("/api/search/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queryId: activeQuery.id }),
        });
      }
    } catch (err) {
      console.error("Search run failed:", err);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/discover" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Mudita
            </h1>
            <p className="text-xs text-slate-500 -mt-0.5">Talent Scout</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Run Search Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleRunSearch}
          disabled={isRunning}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
            isRunning
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
          )}
        >
          <Search className="w-4 h-4" />
          {isRunning ? "Searching..." : "Run Search"}
        </button>
      </div>
    </aside>
  );
}
