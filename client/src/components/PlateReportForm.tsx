import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, X, Upload, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface Props {
  type: "lost" | "found";
}

export default function PlateReportForm({ type }: Props) {
  const [, navigate] = useLocation();
  const [plateNumber, setPlateNumber] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [locationApprox, setLocationApprox] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.upload.getUploadUrl.useMutation();

  const reportLost = trpc.plates.reportLost.useMutation({
    onSuccess: () => {
      toast.success("Reporte de placa perdida publicado correctamente.");
      navigate("/mis-placas");
    },
    onError: (err) => toast.error(err.message ?? "Error al publicar el reporte"),
  });

  const reportFound = trpc.plates.reportFound.useMutation({
    onSuccess: () => {
      toast.success("Reporte de placa encontrada publicado correctamente.");
      navigate("/encontradas");
    },
    onError: (err) => toast.error(err.message ?? "Error al publicar el reporte"),
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      toast.error("El número de placa es obligatorio");
      return;
    }

    let photoUrl: string | undefined;
    let photoKey: string | undefined;

    if (photoFile) {
      setUploading(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const result = ev.target?.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
        const result = await uploadMutation.mutateAsync({
          filename: photoFile.name,
          contentType: photoFile.type,
          base64,
        });
        photoUrl = result.url;
        photoKey = result.key;
      } catch {
        toast.error("Error al subir la foto. Intenta de nuevo.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      plateNumber: plateNumber.trim().toUpperCase(),
      description: description.trim() || undefined,
      incidentDate,
      photoUrl,
      photoKey,
    };

    if (type === "lost") {
      reportLost.mutate(payload);
    } else {
      reportFound.mutate({
        ...payload,
        locationApprox: locationApprox.trim() || undefined,
      });
    }
  };

  const isPending = reportLost.isPending || reportFound.isPending || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plate number */}
      <div className="space-y-2">
        <Label htmlFor="plateNumber" className="text-sm font-semibold">
          Número de placa <span className="text-destructive">*</span>
        </Label>
        <Input
          id="plateNumber"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
          placeholder="Ej. ABC-1234"
          className="font-mono text-xl h-14 tracking-widest text-center font-bold"
          maxLength={20}
          required
        />
        <p className="text-xs text-muted-foreground">
          Ingresa el número tal como aparece en la placa.
        </p>
      </div>

      {/* Incident date */}
      <div className="space-y-2">
        <Label htmlFor="incidentDate" className="text-sm font-semibold">
          Fecha {type === "lost" ? "de pérdida" : "de hallazgo"}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="incidentDate"
          type="date"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
          className="h-11"
        />
      </div>

      {/* Location (found only) */}
      {type === "found" && (
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-semibold">
            Ubicación aproximada
          </Label>
          <Input
            id="location"
            value={locationApprox}
            onChange={(e) => setLocationApprox(e.target.value)}
            placeholder="Ej. Colonia Roma Norte, CDMX"
            maxLength={255}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Zona general donde encontraste la placa. No incluyas dirección exacta.
          </p>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          Descripción adicional
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            type === "lost"
              ? "Ej. Placa de auto sedán azul, se cayó durante la lluvia del martes..."
              : "Ej. La encontré en la banqueta después de la tormenta, está en buen estado..."
          }
          rows={3}
          maxLength={500}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {description.length}/500
        </p>
      </div>

      {/* Photo upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Foto (opcional)</Label>
        {photoPreview ? (
          <Card className="border-dashed border-2 border-border overflow-hidden">
            <CardContent className="p-0 relative">
              <img
                src={photoPreview}
                alt="Vista previa"
                className="w-full h-48 object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow"
                onClick={() => {
                  setPhotoPreview(null);
                  setPhotoFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          >
            <Camera className="w-8 h-8" />
            <div className="text-center">
              <p className="text-sm font-medium">Agregar foto</p>
              <p className="text-xs mt-0.5">JPG, PNG o WEBP · Máx. 5 MB</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-secondary px-3 py-1.5 rounded-full">
              <Upload className="w-3 h-3" />
              Seleccionar archivo
            </div>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhoto}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold gap-2"
        disabled={isPending || !plateNumber.trim()}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {uploading ? "Subiendo foto..." : "Publicando..."}
          </>
        ) : (
          <>
            {type === "lost" ? "Publicar reporte de pérdida" : "Publicar placa encontrada"}
          </>
        )}
      </Button>
    </form>
  );
}
