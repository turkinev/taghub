import { ReactNode, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, ArrowLeft, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  "Администрирование",
  "Модерирование",
  "Организатор",
  "Бухгалтерия",
  "Маркетинг",
  "Статистика",
  "ПВЗ",
];

const profileMenuItems = [
  "Избранные закупки",
  "Список желаний",
  "Личный кабинет",
  "Профиль",
  "Рейтинг",
  "Отправить заявку",
  "Ваши сообщения",
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-card px-4 lg:px-6 gap-4">
          {/* Left zone */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <a href="/" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Вернуться на сайт
            </a>
          </div>

          {/* Right zone */}
          <div className="ml-auto flex items-center gap-1">
            <nav className="hidden xl:flex items-center gap-0.5 overflow-x-auto">
              {navLinks.map((label) => (
                <Button key={label} variant="ghost" size="sm" className="text-xs shrink-0 h-8 px-2.5">
                  {label}
                </Button>
              ))}
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {profileMenuItems.map((item) => (
                  <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6 admin-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
