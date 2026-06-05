import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, MapPin, Calendar, ArrowRight, Plus } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

export default function FoundPlates() {
  const [offset, setOffset] = useState(0);
  const limit = 12;
  const { data: plates = [], isLoading } = trpc.plates.listFound.useQuery({ limit, offset });

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Placas encontradas
          </h1>
          <p className="text-muted-foreground mt-1">
            Listado público de placas disponibles para reclamar.
          </p>
        </div>
        <Link href="/reportar/encontrada">
          <Button className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            Reportar encontrada
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : plates.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            Sin reportes activos
          </h3>
          <p className="text-muted-foreground mb-6">
            No hay placas encontradas reportadas en este momento.
          </p>
          <Link href="/reportar/encontrada">
            <Button>Reportar una placa encontrada</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plates.map((plate) => (
              <Link key={plate.id} href={`/placa/${plate.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-border h-full group">
                  <CardContent className="p-5">
                    {/* Plate number */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5">
                        <span className="font-mono font-bold text-xl text-primary tracking-widest">
                          {plate.plateNumber}
                        </span>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                        Disponible
                      </Badge>
                    </div>

                    {/* Photo */}
                    {plate.photoUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-muted">
                        <img
                          src={plate.photoUrl}
                          alt={`Placa ${plate.plateNumber}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Description */}
                    {plate.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {plate.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {plate.locationApprox && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {plate.locationApprox}
                        </span>
                      )}
                      <span className="flex items-center gap-1 shrink-0 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(plate.createdAt), "d MMM yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-primary text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                      Ver detalle
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {offset > 0 && (
              <Button variant="outline" onClick={() => setOffset(Math.max(0, offset - limit))}>
                Anterior
              </Button>
            )}
            {plates.length === limit && (
              <Button variant="outline" onClick={() => setOffset(offset + limit)}>
                Siguiente
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
