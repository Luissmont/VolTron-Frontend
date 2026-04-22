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

        <nav className="bg-gunmetal border-b border-iron-grey sticky top-0 z-50 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

            <Link href="/" className="text-xl font-bold text-platinum tracking-wide hover:text-white transition-colors">
              VolTron
            </Link>

            <div className="flex space-x-8 text-sm font-semibold text-pale-slate-dark items-center">
              <Link
                href="/"
                className="hover:text-bright-snow transition-colors"
              >
                Taller
              </Link>
              <Link
                href="/ensamblaje"
                className="hover:text-bright-snow transition-colors"
              >
                Mesa de Ensamblaje
              </Link>

              <div className="flex items-center ml-4 pl-4 border-l border-iron-grey gap-4">
                {!token_sesion ? (
                  <>
                    <span className="text-xs font-bold text-slate-grey">[Modo Invitado]</span>
                    <Link href="/auth/login" className="hover:text-bright-snow transition-colors">
                      Entrar
                    </Link>
                    <Link href="/auth/registro" className="hover:text-bright-snow transition-colors">
                      Crear Cuenta
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-green-500">[Modo Ingeniero]</span>
                    <button type="button" onClick={cerrar_sesion} className="hover:text-[#721c24] transition-colors font-bold">
                      Cerrar Sesion
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </nav>
        <div className="flex-grow">
          {children}
        </div>

      </body>
    </html>
  );
}