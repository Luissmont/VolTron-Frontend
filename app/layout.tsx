"use client";

import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [token_sesion, set_token_sesion] = useState<string | null>(null);

  useEffect(() => {
    const token_guardado = localStorage.getItem("token_voltron");
    set_token_sesion(token_guardado);
  }, []);

  const cerrar_sesion = () => {
    localStorage.removeItem("token_voltron");
    window.location.reload();
  };

  return (
    <html lang="es">
      <head>
        <title>VolTron | Ingenieria</title>
        <meta name="description" content="Plataforma de ensamblaje y validacion de circuitos" />
      </head>
      <body className="bg-shadow-grey text-bright-snow font-sans min-h-screen flex flex-col antialiased">

        <div className="sticky top-0 z-50 px-4 pt-4 pb-2">
          <nav className="max-w-screen-xl mx-auto bg-gunmetal/70 backdrop-blur-xl border border-iron-grey/30 rounded-2xl shadow-2xl px-6 h-14 flex items-center justify-between gap-6">

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-black text-white tracking-widest uppercase">
                Vol<span className="text-slate-grey">Tron</span>
              </span>
            </Link>

            <div className="flex items-center gap-1 bg-shadow-grey/50 border border-iron-grey/30 rounded-xl px-2 py-1">
              <Link
                href="/"
                className="px-4 py-1.5 text-xs font-semibold text-pale-slate-dark hover:text-white hover:bg-iron-grey/60 rounded-lg transition-all duration-200"
              >
                Taller
              </Link>
              <Link
                href="/ensamblaje"
                className="px-4 py-1.5 text-xs font-semibold text-pale-slate-dark hover:text-white hover:bg-iron-grey/60 rounded-lg transition-all duration-200"
              >
                Mesa de Ensamblaje
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!token_sesion ? (
                <>
                  <span className="text-xs font-mono text-iron-grey hidden sm:block">
                    Sin sesion
                  </span>
                  <Link
                    href="/auth/login"
                    className="px-4 py-1.5 text-xs font-semibold text-pale-slate-dark hover:text-white border border-iron-grey/40 hover:border-iron-grey rounded-lg transition-all duration-200"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/registro"
                    className="px-4 py-1.5 text-xs font-bold text-shadow-grey bg-platinum hover:bg-white rounded-lg transition-all duration-200"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-xs font-mono text-green-400 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded-lg">
                    Ingeniero
                  </span>
                  <button
                    type="button"
                    onClick={cerrar_sesion}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-grey hover:text-red-400 border border-iron-grey/30 hover:border-red-500/40 rounded-lg transition-all duration-200"
                  >
                    Salir
                  </button>
                </>
              )}
            </div>

          </nav>
        </div>
        <div className="flex-grow">
          {children}
        </div>

      </body>
    </html>
  );
}