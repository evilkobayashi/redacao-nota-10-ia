import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redação Nota 10 AÍ",
  description: "Correção automática de redações ENEM usando IA Avançada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <header className="bg-primary text-white py-4 px-6 shadow-md">
            <h1 className="text-xl font-bold tracking-tight">Redação Nota 10 AÍ</h1>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="text-center py-4 text-sm text-slate-500">
            © 2026 Aí Tecnologia e Educação Ltda.
          </footer>
        </div>
      </body>
    </html>
  );
}
