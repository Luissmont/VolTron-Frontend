import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VolTron | Ingeniería",
  description: "Plataforma de ensamblaje y validación de circuitos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-shadow-grey text-bright-snow font-sans min-h-screen flex flex-col antialiased">

        <nav className="bg-gunmetal border-b border-iron-grey sticky top-0 z-50 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

            <Link href="/" className="text-xl font-bold text-platinum tracking-wide hover:text-white transition-colors">
              VolTron
            </Link>

            <div className="flex space-x-8 text-sm font-semibold text-pale-slate-dark">
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
              <Link
                href="#"
                className="hover:text-bright-snow transition-colors cursor-not-allowed opacity-50 title='Próximamente'"
              >
                Identidad
              </Link>
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