import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redação Nota 10 AÍ — Correção de Redações ENEM com IA",
  description: "Sua redação corrigida por IA treinada nos manuais oficiais do INEP. Feedback instantâneo nas 5 competências do ENEM. Alcance a nota 1000.",
  keywords: ["redação ENEM", "correção IA", "nota 1000", "competências ENEM", "INEP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
