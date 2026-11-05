import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://redacao.aitecnologia.xyz"),
  title: "Redação Nota 10 AÍ — Correção de Redações ENEM e Concursos com IA",
  description:
    "Sua redação manuscrita ou digitada corrigida por Inteligência Artificial nas 5 competências oficiais do ENEM, FUVEST e VUNESP. Feedback linha a linha em segundos.",
  keywords: [
    "Redação Nota 10 AÍ",
    "redação ENEM",
    "correção de redação IA",
    "nota 1000 ENEM",
    "competências ENEM",
    "correção redação foto",
    "INEP",
  ],
  alternates: {
    canonical: "https://redacao.aitecnologia.xyz/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://redacao.aitecnologia.xyz/",
    siteName: "Redação Nota 10 AÍ",
    title: "Redação Nota 10 AÍ — Correção de Redações ENEM com IA",
    description:
      "Avaliação diagnóstica de redações manuscritas ou digitadas nas 5 competências oficiais do ENEM, vestibulares e concursos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redação Nota 10 AÍ — Correção de Redações ENEM com IA",
    description:
      "Sua redação corrigida em segundos nas 5 competências oficiais do ENEM.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Redação Nota 10 AÍ",
  url: "https://redacao.aitecnologia.xyz/",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  description:
    "Avaliação diagnóstica de redações manuscritas ou digitadas nas cinco competências oficiais do ENEM, FUVEST e VUNESP.",
  provider: {
    "@type": "Organization",
    name: "AÍ Tecnologia e Educação",
    url: "https://aitecnologia.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg"
        >
          Pular para o conteúdo principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
