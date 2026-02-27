import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  Tags,
  ShoppingBag,
  ChevronLeft,
  Link,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { title: "Подборки", href: "/collections", icon: ShoppingBag },
  { title: "Теги", href: "/tags", icon: Tags },
  { title: "Назначение тегов", href: "/tag-assignment", icon: Link },
  { title: "Посты", href: "/admin/posts", icon: Newspaper },
];

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        open ? "w-60" : "w-0 lg:w-14"
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-4",
          !open && "lg:justify-center lg:px-0"
        )}
      >
        {open && (
          <span className="text-lg font-bold text-sidebar-primary-foreground tracking-tight truncate">
            Admin Panel
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "ml-auto rounded-md p-1 text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors",
            !open && "lg:ml-0"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              !open && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-3 admin-scrollbar", !open && "overflow-hidden")}>
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <RouterNavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    !open && "lg:justify-center lg:px-0"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {open && <span className="truncate">{item.title}</span>}
                </RouterNavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
