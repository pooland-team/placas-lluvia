import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, AlertTriangle, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Search() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, error } = trpc.plates.search.useQuery(
    { plateNumber: submitted },
    { enabled: submitted.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSubmitted(query.trim().toUpperCase());
  };

  const totalResults = (data?.lost?.length ?? 0) + (data?.found?.length ?? 0);

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Buscar placa
          </h1>
          <p className="text-muted-foreground">
            Ingresa el número de placa para cruzar reportes de pérdidas y hallazgos.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Ej. ABC-1234"
            className="font-mono text-lg h-12 tracking-wider text-center"
            maxLength={20}
          />
          <Button type="submit" size="lg" disabled={!query.trim() || isLoading} className="shrink-0 px-6">
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <SearchIcon className="w-5 h-5" />
            )}
          </Button>
        </form>

        {/* Error state */}
        {error && (
          <div className="text-center py-8 bg-destructive/5 border border-destructive/20 rounded-xl">
            <p className="text-destructive text-sm">Error al buscar. Intenta de nuevo.</p>
          </div>
        )}

        {/* Results */}
        {submitted && !isLoading && !error && data && (
          <div className="animate-fade-in-up">
            {totalResults === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border">
                <SearchIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Sin resultados</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No se encontraron reportes para la placa{" "}
                  <span className="font-mono font-bold">{submitted}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/reportar/perdida">
                    <Button variant="outline" size="sm">Reportar como perdida</Button>
                  </Link>
                  <Link href="/reportar/encontrada">
                    <Button variant="outline" size="sm">Reportar como encontrada</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground text-center">
                  Se encontraron <span className="font-semibold text-foreground">{totalResults}</span> reporte(s) para{" "}
                  <span className="font-mono font-bold text-primary">{submitted}</span>
                </p>

                {/* Lost reports */}
                {data.lost.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h2 className="font-semibold text-foreground">
                        Reportes de pérdida ({data.lost.length})
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {data.lost.map((plate) => (
                        <Link key={plate.id} href={`/placa/${plate.id}`}>
                          <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-mono font-bold text-lg text-primary tracking-widest">
                                      {plate.plateNumber}
                                    </span>
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                      Perdida
                                    </Badge>
                                    {plate.estadoPlaca && (
                                      <Badge variant="outline" className="text-xs gap-1">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {plate.estadoPlaca}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Reportada el {format(new Date(plate.createdAt), "d 'de' MMMM yyyy", { locale: es })}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Found reports */}
                {data.found.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <h2 className="font-semibold text-foreground">
                        Reportes de hallazgo ({data.found.length})
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {data.found.map((plate) => (
                        <Link key={plate.id} href={`/placa/${plate.id}`}>
                          <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-mono font-bold text-lg text-primary tracking-widest">
                                      {plate.plateNumber}
                                    </span>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                      Encontrada
                                    </Badge>
                                    {plate.estadoPlaca && (
                                      <Badge variant="outline" className="text-xs gap-1">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {plate.estadoPlaca}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Reportada el {format(new Date(plate.createdAt), "d 'de' MMMM yyyy", { locale: es })}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross match alert */}
                {data.lost.length > 0 && data.found.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-emerald-800 font-semibold text-sm">
                      ¡Coincidencia encontrada!
                    </p>
                    <p className="text-emerald-700 text-sm mt-1">
                      Hay reportes de pérdida y hallazgo para esta placa. Entra al detalle y contacta a la otra parte.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
