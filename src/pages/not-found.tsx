// src/pages/not-found.tsx
// FIX: El original usaba bg-gray-50 y Card de shadcn que no existe en este proyecto.
// Ahora usa el tema oscuro del resto de la app.

import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={36} className="text-destructive" />
        </div>
        <h1 className="text-6xl font-display text-primary mb-4">404</h1>
        <h2 className="text-2xl font-display text-foreground mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
