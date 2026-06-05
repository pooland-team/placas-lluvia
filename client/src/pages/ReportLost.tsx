import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import PlateReportForm from "@/components/PlateReportForm";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ReportLost() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-md text-center">
        <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
          Inicia sesión para continuar
        </h2>
        <p className="text-muted-foreground mb-6">
          Necesitas una cuenta para publicar reportes y recibir notificaciones.
        </p>
        <Button
          className="w-full"
          onClick={() => (window.location.href = getLoginUrl())}
        >
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-xl">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Reportar placa perdida
            </h1>
            <p className="text-sm text-muted-foreground">
              Publica tu reporte para que quien la encuentre pueda contactarte.
            </p>
          </div>
        </div>
      </div>

      <PlateReportForm type="lost" />
    </div>
  );
}
