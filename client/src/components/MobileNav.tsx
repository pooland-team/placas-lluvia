import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Plus, MessageSquare, ListChecks } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { ManusDialog } from "@/components/ManusDialog";

export default function MobileNav() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);

  const { data: unread = 0 } = trpc.messaging.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const isActive = (path: string) =>
    location === path || location.startsWith(path + "/");

  const navItem = (href: string, icon: React.ReactNode, label: string, badge?: number) => (
    <Link href={href}>
      <div
        className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
          isActive(href)
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="relative">
          {icon}
          {badge && badge > 0 ? (
            <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 text-[9px] flex items-center justify-center bg-accent text-accent-foreground">
              {badge > 9 ? "9+" : badge}
            </Badge>
          ) : null}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </Link>
  );

  const loginNavItem = (icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setLoginOpen(true)}
      className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItem("/", <Home className="w-5 h-5" />, "Inicio")}
          {navItem("/encontradas", <ListChecks className="w-5 h-5" />, "Encontradas")}

          {/* Central CTA */}
          {isAuthenticated ? (
            <Link href="/reportar/perdida">
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 -mt-4">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Reportar</span>
              </div>
            </Link>
          ) : (
            <button onClick={() => setLoginOpen(true)} className="flex flex-col items-center gap-0.5 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 -mt-4">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Reportar</span>
            </button>
          )}

          {navItem("/buscar", <Search className="w-5 h-5" />, "Buscar")}

          {isAuthenticated
            ? navItem("/mensajes", <MessageSquare className="w-5 h-5" />, "Mensajes", unread)
            : loginNavItem(<MessageSquare className="w-5 h-5" />, "Mensajes")}
        </div>
      </nav>

      <ManusDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={() => { window.location.href = getLoginUrl(); }}
        title="Bienvenido"
      />
    </>
  );
}
