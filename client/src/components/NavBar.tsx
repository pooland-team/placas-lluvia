import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  ChevronDown,
  LogOut,
  Car,
  Plus,
  ListChecks,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ManusDialog } from "@/components/ManusDialog";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);

  const { data: unread = 0 } = trpc.messaging.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const isActive = (path: string) =>
    location === path ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-semibold text-lg text-foreground hidden sm:block">
                ¿Dónde están mis placas?
              </span>
              <span className="font-serif font-semibold text-base text-foreground sm:hidden">
                Mis Placas
              </span>
            </div>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/encontradas">
              <span className={`cursor-pointer transition-colors ${isActive("/encontradas")}`}>
                Placas encontradas
              </span>
            </Link>
            <Link href="/buscar">
              <span className={`cursor-pointer transition-colors flex items-center gap-1 ${isActive("/buscar")}`}>
                <Search className="w-3.5 h-3.5" />
                Buscar
              </span>
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Report button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="hidden sm:flex gap-1">
                      <Plus className="w-4 h-4" />
                      Reportar
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/reportar/perdida">
                        <span className="flex items-center gap-2 w-full cursor-pointer">
                          Placa perdida
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reportar/encontrada">
                        <span className="flex items-center gap-2 w-full cursor-pointer">
                          Placa encontrada
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Messages */}
                <Link href="/mensajes">
                  <Button variant="ghost" size="sm" className="relative hidden sm:flex">
                    <MessageSquare className="w-4 h-4" />
                    {unread > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-accent text-accent-foreground">
                        {unread > 9 ? "9+" : unread}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <span className="hidden sm:block text-sm max-w-[100px] truncate">
                        {user?.name?.split(" ")[0] ?? "Usuario"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/mis-placas">
                        <span className="flex items-center gap-2 w-full cursor-pointer">
                          <ListChecks className="w-4 h-4" />
                          Mis reportes
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                >
                  Iniciar sesión
                </Button>
                <ManusDialog
                  open={loginOpen}
                  onOpenChange={setLoginOpen}
                  onLogin={() => { window.location.href = getLoginUrl(); }}
                  title="Bienvenido"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
