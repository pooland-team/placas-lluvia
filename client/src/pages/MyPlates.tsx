import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MyPlates() {
  const { isAuthenticated, loading } = useAuth();
  const { data: plates = [], isLoading } = trpc.plates.myPlates.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading || (!isAuthenticated && loading)) {
    return (
      <div className="container py-16 flex justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-md text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
          Inicia sesión
        </h2>
        <p className="text-muted-foreground mb-6">
          Necesitas una cuenta para ver tus reportes.
        </p>
        <Button onClick={() => (window.location.href = getLoginUrl())}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Mis reportes
          </h1>
          <p className="text-muted-foreground mt-1">
            Placas que has reportado como perdidas o encontradas.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/reportar/perdida">
            <Button variant="outline" size="sm" className="gap-1">
              <AlertTriangle className="w-4 h-4" />
              Perdida
            </Button>
          </Link>
          <Link href="/reportar/encontrada">
            <Button size="sm" className="gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Encontrada
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : plates.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
          <Plus className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            Sin reportes aún
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Publica tu primer reporte para que otros puedan ayudarte a recuperar tu placa o para devolver una que encontraste.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/reportar/perdida">
              <Button variant="outline" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Perdí mi placa
              </Button>
            </Link>
            <Link href="/reportar/encontrada">
              <Button className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Encontré una placa
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {plates.map((plate) => (
            <Link key={plate.id} href={`/placa/${plate.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Photo thumbnail */}
                    {plate.photoUrl ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img
                          src={plate.photoUrl}
                          alt={plate.plateNumber}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                        {plate.type === "lost" ? (
                          <AlertTriangle className="w-6 h-6 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono font-bold text-lg text-primary tracking-widest">
                          {plate.plateNumber}
                        </span>
                        <Badge
                          className={
                            plate.type === "found"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                              : "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                          }
                        >
                          {plate.type === "found" ? "Encontrada" : "Perdida"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            plate.status === "active"
                              ? "text-foreground text-xs"
                              : plate.status === "claimed"
                              ? "text-blue-700 border-blue-200 bg-blue-50 text-xs"
                              : "text-muted-foreground text-xs"
                          }
                        >
                          {plate.status === "active"
                            ? "Activo"
                            : plate.status === "claimed"
                            ? "Reclamado"
                            : "Cerrado"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(plate.createdAt), "d MMM yyyy", { locale: es })}
                        </span>
                        {plate.estadoPlaca && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {plate.estadoPlaca}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
