import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  ShieldCheck,
  Car,
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function ConversationList({
  activeId,
  onSelect,
}: {
  activeId?: number;
  onSelect: (id: number) => void;
}) {
  const { data: convs = [], isLoading } = trpc.messaging.myConversations.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (convs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground">
          No tienes conversaciones aún.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Contacta a alguien desde el detalle de una placa.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {convs.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
            activeId === conv.id ? "bg-primary/5 border-l-2 border-primary" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
              {conv.otherAlias[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm text-foreground truncate">
                  {conv.otherAlias}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {format(new Date(conv.lastMessageAt), "d MMM", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Car className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-primary font-semibold">
                  {conv.plateNumber}
                </span>
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.lastMessage}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatView({ conversationId }: { conversationId: number }) {
  const utils = trpc.useUtils();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = trpc.messaging.getMessages.useQuery(
    { conversationId },
    { refetchInterval: 5000 }
  );

  const sendMessage = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setText("");
      utils.messaging.getMessages.invalidate({ conversationId });
      utils.messaging.myConversations.invalidate();
      utils.messaging.unreadCount.invalidate();
    },
    onError: (err) => toast.error(err.message ?? "Error al enviar"),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage.mutate({ conversationId, content: text.trim() });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Privacy banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border-b border-border text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>Conversación protegida. No se comparten datos personales.</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-2" />
            <p className="text-sm text-muted-foreground">
              Sé el primero en enviar un mensaje.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {!msg.isMine && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {msg.senderAlias}
                    </p>
                  )}
                  <p>{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 border-t border-border bg-background"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 h-10 rounded-full"
          maxLength={2000}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 w-10 p-0 rounded-full shrink-0"
          disabled={!text.trim() || sendMessage.isPending}
        >
          {sendMessage.isPending ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

export default function Messaging() {
  const { isAuthenticated, loading } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const activeId = id ? parseInt(id) : undefined;

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
        <MessageSquare className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
          Inicia sesión
        </h2>
        <p className="text-muted-foreground mb-6">
          Necesitas una cuenta para acceder a tus mensajes.
        </p>
        <Button onClick={() => (window.location.href = getLoginUrl())}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-0 px-0 md:py-8 md:px-4 max-w-5xl">
      <div className="flex h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-8rem)] md:rounded-2xl md:border md:border-border overflow-hidden bg-background shadow-sm">
        {/* Sidebar — conversation list */}
        <div
          className={`w-full md:w-80 border-r border-border flex flex-col shrink-0 ${
            activeId ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-serif font-semibold text-foreground">Mensajes</h2>
            <Badge variant="secondary" className="text-xs">
              Privados
            </Badge>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              activeId={activeId}
              onSelect={(id) => navigate(`/mensajes/${id}`)}
            />
          </div>
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 flex flex-col ${
            activeId ? "flex" : "hidden md:flex"
          }`}
        >
          {activeId ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden -ml-2 h-8 w-8 p-0"
                  onClick={() => navigate("/mensajes")}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Conversación</p>
                  <p className="text-xs text-muted-foreground">
                    Identidades protegidas
                  </p>
                </div>
              </div>
              <ChatView conversationId={activeId} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="w-16 h-16 text-muted-foreground/15 mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Elige una conversación de la lista para ver los mensajes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
