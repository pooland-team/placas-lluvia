import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

export default function PlateDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data: plate, isLoading } = trpc.plates.getById.useQuery(
    { id: parseInt(id ?? "0") },
    { enabled: !!id }
  );

  const startConversation = trpc.messaging.startConversation.useMutation({
    onSuccess: ({ conversationId }) => {
      toast.success("Mensaje enviado. Puedes continuar la conversación en Mensajes.");
      setContactOpen(false);
      navigate(`/mensajes/${conversationId}`);
    },
    onError: (err) => {
      toast.error(err.message ?? "Error al enviar el mensaje");
    },
  });

  const handleContact = () => {
    if (!message.trim()) return;
    startConversation.mutate({
      foundPlateId: parseInt(id ?? "0"),
      initialMessage: message.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 max-w-2xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 rounded-2xl mb-4" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!plate) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground mb-4">Reporte no encontrado.</p>
        <Link href="/encontradas">
          <Button variant="outline">Volver al listado</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === plate.userId;
  const isFound = plate.type === "found";

  return (
    <div className="container py-8 max-w-2xl">
      {/* Back */}
      <Link href={isFound ? "/encontradas" : "/mis-placas"}>
        <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </Link>

      {/* Main card */}
      <Card className="border-border overflow-hidden mb-4">
        {/* Photo */}
        {plate.photoUrl && (
          <div className="w-full h-56 bg-muted overflow-hidden">
            <img
              src={plate.photoUrl}
              alt={`Placa ${plate.plateNumber}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardContent className="p-6">
          {/* Plate number + status */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 inline-block mb-2">
                <span className="font-mono font-bold text-3xl text-primary tracking-widest">
                  {plate.plateNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    isFound
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {isFound ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {isFound ? "Encontrada" : "Perdida"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    plate.status === "active"
                      ? "text-foreground"
                      : plate.status === "claimed"
                      ? "text-blue-700 border-blue-200 bg-blue-50"
                      : "text-muted-foreground"
                  }
                >
                  {plate.status === "active"
                    ? "Activo"
                    : plate.status === "claimed"
                    ? "Reclamado"
                    : "Cerrado"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {plate.description && (
            <p className="text-foreground/80 leading-relaxed mb-4">
              {plate.description}
            </p>
          )}

          {/* Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                {isFound ? "Encontrada" : "Perdida"} el{" "}
                {format(new Date(plate.incidentDate), "d 'de' MMMM yyyy", { locale: es })}
              </span>
            </div>
            {plate.locationApprox && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{plate.locationApprox}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <span>Reportado por {plate.reporterAlias}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                Publicado el{" "}
                {format(new Date(plate.createdAt), "d 'de' MMMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-xl p-4 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">
          El contacto se realiza a través de mensajería interna. Ningún dato personal de ninguna de las partes será compartido.
        </p>
      </div>

      {/* CTA */}
      {!isOwner && isFound && plate.status === "active" && (
        <>
          {isAuthenticated ? (
            <Button
              className="w-full gap-2 h-12 text-base"
              onClick={() => setContactOpen(true)}
            >
              <MessageSquare className="w-5 h-5" />
              Contactar a quien la encontró
            </Button>
          ) : (
            <Button
              className="w-full gap-2 h-12 text-base"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Inicia sesión para contactar
            </Button>
          )}
        </>
      )}

      {/* Contact dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Enviar mensaje</DialogTitle>
            <DialogDescription>
              Escribe un mensaje para quien encontró la placa{" "}
              <span className="font-mono font-bold text-primary">
                {plate.plateNumber}
              </span>
              . Tu identidad estará protegida.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: Hola, creo que esa placa es mía. ¿Podemos coordinar la devolución?"
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setContactOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleContact}
                disabled={!message.trim() || startConversation.isPending}
              >
                {startConversation.isPending ? (
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
