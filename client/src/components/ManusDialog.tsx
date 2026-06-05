import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield } from "lucide-react";
import { Link } from "wouter";

interface ManusDialogProps {
  title?: string;
  logo?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

// SVG icons para Google y Facebook
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function ManusDialog({
  title,
  logo,
  open = false,
  onLogin,
  onOpenChange,
  onClose,
}: ManusDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (!onOpenChange) {
      setInternalOpen(open);
    }
  }, [open, onOpenChange]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={onOpenChange ? open : internalOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="w-[92vw] max-w-[400px] rounded-2xl p-0 gap-0 overflow-hidden border border-border/60 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6 bg-background">
          {logo ? (
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-1">
              <img src={logo} alt="" className="w-9 h-9 rounded-xl object-contain" />
            </div>
          ) : (
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-1">
              <Shield className="w-7 h-7 text-primary" />
            </div>
          )}

          <DialogTitle className="text-xl font-serif font-bold text-foreground text-center leading-tight">
            {title ?? "Accede a tu cuenta"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Inicia sesión para reportar o reclamar una placa
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-6" />

        {/* Login options */}
        <div className="flex flex-col gap-3 px-6 py-6">
          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
            onClick={onLogin}
          >
            <GoogleIcon />
            Continuar con Google
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
            onClick={onLogin}
          >
            <FacebookIcon />
            Continuar con Facebook
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
            onClick={onLogin}
          >
            <EmailIcon />
            Continuar con correo electrónico
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos">
              <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                Términos de uso
              </span>
            </Link>
            {" "}y{" "}
            <Link href="/privacidad">
              <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                Política de privacidad
              </span>
            </Link>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
