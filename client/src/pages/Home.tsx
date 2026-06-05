import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Car,
  Droplets,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function PlateCard({ plate }: { plate: { id: number; plateNumber: string; locationApprox?: string | null; createdAt: Date; description?: string | null } }) {
  return (
    <Link href={`/placa/${plate.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-lg text-primary tracking-widest">
                  {plate.plateNumber}
                </span>
                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  Encontrada
                </Badge>
              </div>
              {plate.locationApprox && (
                <p className="text-sm text-muted-foreground truncate">
                  📍 {plate.locationApprox}
                </p>
              )}
              {plate.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {plate.description}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">
                {format(new Date(plate.createdAt), "d MMM", { locale: es })}
              </p>
              <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: foundPlates = [] } = trpc.plates.listFound.useQuery({ limit: 4, offset: 0 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">
                Plataforma de recuperación
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
              Recupera tu placa después de la lluvia
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Conectamos a quienes pierden sus placas vehiculares durante lluvias con quienes las encuentran, de forma segura y sin exponer datos personales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/reportar/perdida">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4" />
                      Perdí mi placa
                    </Button>
                  </Link>
                  <Link href="/reportar/encontrada">
                    <Button size="lg" className="w-full sm:w-auto gap-2 font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      Encontré una placa
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto gap-2 font-semibold"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Perdí mi placa
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Encontré una placa
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="bg-background border-b border-border py-6">
        <div className="container">
          <Link href="/buscar">
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/70 transition-colors max-w-xl">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Buscar placa por número...</span>
            </div>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Un proceso simple y seguro para reconectar placas con sus dueños.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="w-7 h-7 text-primary" />,
                title: "Reporta",
                desc: "Publica si perdiste o encontraste una placa con foto y descripción. Es rápido y gratuito.",
                step: "01",
              },
              {
                icon: <Search className="w-7 h-7 text-primary" />,
                title: "Busca y cruza",
                desc: "El sistema cruza automáticamente los reportes de placas perdidas y encontradas por número.",
                step: "02",
              },
              {
                icon: <MessageSquare className="w-7 h-7 text-primary" />,
                title: "Contacta de forma segura",
                desc: "Usa la mensajería interna para coordinar la devolución sin revelar datos personales.",
                step: "03",
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-4xl font-serif font-bold text-border">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent found plates */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Placas encontradas recientemente
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                ¿Reconoces alguna? Contáctanos para reclamarla.
              </p>
            </div>
            <Link href="/encontradas">
              <Button variant="ghost" size="sm" className="gap-1 hidden sm:flex">
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {foundPlates.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aún no hay placas encontradas reportadas.
              </p>
              <Link href="/reportar/encontrada">
                <Button variant="outline" size="sm" className="mt-4">
                  Reportar placa encontrada
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foundPlates.map((plate) => (
                <PlateCard key={plate.id} plate={plate} />
              ))}
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <Link href="/encontradas">
              <Button variant="outline" className="w-full gap-2">
                Ver todas las placas encontradas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Tu privacidad, protegida
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Toda la comunicación entre las partes ocurre a través de nuestra mensajería interna. Nunca compartimos tu nombre completo, teléfono, correo ni ningún dato personal con otros usuarios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { label: "Sin datos expuestos", desc: "Solo usamos alias para identificarte ante otros usuarios." },
                { label: "Mensajería cifrada", desc: "Los mensajes solo son visibles para los participantes de la conversación." },
                { label: "Tú decides", desc: "Puedes cerrar cualquier conversación en cualquier momento." },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/40 rounded-xl p-4 border border-border">
                  <p className="font-semibold text-foreground text-sm mb-1">{item.label}</p>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Car className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-serif text-sm font-semibold text-foreground">
                ¿Dónde están mis placas?
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground text-center">
                Plataforma de recuperación de placas vehiculares. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-3 text-xs">
                <Link href="/terminos" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                  Términos de uso
                </Link>
                <span className="text-border">·</span>
                <Link href="/privacidad" className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                  Política de privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
