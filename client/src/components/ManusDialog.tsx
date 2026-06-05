import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Link } from "wouter";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
} from "@/lib/firebase";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ManusDialogProps {
  open?: boolean;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

type View = "main" | "email" | "register" | "reset";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

async function exchangeFirebaseToken(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/firebase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).error || "Error al iniciar sesión");
  }
}

export function ManusDialog({
  open = false,
  onSuccess,
  onOpenChange,
  onClose,
}: ManusDialogProps) {
  const [view, setView] = useState<View>("main");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const utils = trpc.useUtils();

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      onClose?.();
      setView("main");
      setEmail("");
      setPassword("");
      setResetSent(false);
    }
  };

  async function afterLogin(idToken: string) {
    await exchangeFirebaseToken(idToken);
    await utils.auth.me.invalidate();
    handleOpenChange(false);
    onSuccess?.();
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      await afterLogin(idToken);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("No se pudo iniciar sesión con Google");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFacebook() {
    setLoading(true);
    try {
      const user = await signInWithFacebook();
      const idToken = await user.getIdToken();
      await afterLogin(idToken);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("No se pudo iniciar sesión con Facebook");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      const idToken = await user.getIdToken();
      await afterLogin(idToken);
    } catch (err: any) {
      const msg =
        err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password"
          ? "Correo o contraseña incorrectos"
          : err?.code === "auth/user-not-found"
          ? "No existe una cuenta con ese correo"
          : "Error al iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await registerWithEmail(email, password);
      const idToken = await user.getIdToken();
      await afterLogin(idToken);
    } catch (err: any) {
      const msg =
        err?.code === "auth/email-already-in-use"
          ? "Ya existe una cuenta con ese correo"
          : err?.code === "auth/weak-password"
          ? "La contraseña debe tener al menos 6 caracteres"
          : "Error al crear la cuenta";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      toast.error("No se pudo enviar el correo de recuperación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[92vw] max-w-[400px] rounded-2xl p-0 gap-0 overflow-hidden border border-border/60 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-5 bg-background">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-1">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-xl font-serif font-bold text-foreground text-center leading-tight">
            {view === "main" && "Accede a tu cuenta"}
            {view === "email" && "Iniciar sesión"}
            {view === "register" && "Crear cuenta"}
            {view === "reset" && "Recuperar contraseña"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {view === "main" && "Inicia sesión para reportar o reclamar una placa"}
            {view === "email" && "Ingresa tu correo y contraseña"}
            {view === "register" && "Crea tu cuenta con correo electrónico"}
            {view === "reset" && "Te enviaremos un enlace de recuperación"}
          </p>
        </div>

        <div className="h-px bg-border mx-6" />

        {/* Main view */}
        {view === "main" && (
          <div className="flex flex-col gap-3 px-6 py-6">
            <Button
              variant="outline"
              className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
              onClick={handleGoogle}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              Continuar con Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
              onClick={handleFacebook}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FacebookIcon />}
              Continuar con Facebook
            </Button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">o</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full h-11 gap-3 font-medium text-sm border-border/70 hover:bg-muted/60 justify-start px-4"
              onClick={() => setView("email")}
              disabled={loading}
            >
              <Mail className="w-5 h-5 shrink-0" />
              Continuar con correo electrónico
            </Button>
          </div>
        )}

        {/* Email login view */}
        {view === "email" && (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 px-6 py-6">
            <button
              type="button"
              onClick={() => setView("main")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
            >
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Iniciar sesión
            </Button>
            <div className="flex justify-between text-xs text-muted-foreground">
              <button type="button" onClick={() => setView("register")} className="hover:text-foreground transition-colors underline underline-offset-2">
                Crear cuenta
              </button>
              <button type="button" onClick={() => setView("reset")} className="hover:text-foreground transition-colors underline underline-offset-2">
                Olvidé mi contraseña
              </button>
            </div>
          </form>
        )}

        {/* Register view */}
        {view === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4 px-6 py-6">
            <button
              type="button"
              onClick={() => setView("email")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
            >
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Crear cuenta
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={() => setView("email")} className="underline underline-offset-2 hover:text-foreground transition-colors">
                Iniciar sesión
              </button>
            </p>
          </form>
        )}

        {/* Reset password view */}
        {view === "reset" && (
          <div className="flex flex-col gap-4 px-6 py-6">
            <button
              type="button"
              onClick={() => setView("email")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
            >
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>
            {resetSent ? (
              <div className="text-center py-4">
                <p className="text-sm text-foreground font-medium mb-1">Correo enviado</p>
                <p className="text-xs text-muted-foreground">
                  Revisa tu bandeja de entrada en <strong>{email}</strong> para restablecer tu contraseña.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Enviar enlace de recuperación
                </Button>
              </form>
            )}
          </div>
        )}

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
