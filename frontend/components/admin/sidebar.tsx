"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Library,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Paintings", href: "/admin/paintings", icon: ImageIcon },
  { label: "Collections", href: "/admin/collections", icon: Library },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-charcoal text-ivory">
      <div className="px-6 py-8 border-b border-ivory/10">
        <Link
          href="/"
          className="font-display text-xl tracking-widest uppercase text-ivory"
        >
          Dahlia
        </Link>
        <p className="text-xs text-ivory/40 mt-1 tracking-widest uppercase">
          Admin
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors duration-400",
                isActive
                  ? "bg-ivory/10 text-ivory"
                  : "text-ivory/60 hover:text-ivory hover:bg-ivory/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {isActive && (
                <ChevronRight className="h-3 w-3 ml-auto text-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-ivory/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-ivory/60 hover:text-ivory transition-colors duration-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
