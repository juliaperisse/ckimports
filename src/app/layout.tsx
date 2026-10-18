import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";
import { CarrinhoProvider } from "@/components/carrinho-contexto";
import Cabecalho from "@/components/cabecalho";
import Rodape from "@/components/rodape";
import BotaoWhatsApp from "@/components/botao-whatsapp";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fonte-display",
});

const corpo = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--fonte-corpo",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — Tênis importados`,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricao,
  openGraph: {
    title: `${SITE.nome} — Tênis importados`,
    description: SITE.descricao,
    url: SITE.url,
    siteName: SITE.nome,
    locale: "pt_BR",
    type: "website",
    images: ["/logo-ck.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body className="min-h-screen flex flex-col bg-preto">
        <CarrinhoProvider>
          <Cabecalho />
          <main className="flex-1">{children}</main>
          <Rodape />
          <BotaoWhatsApp />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
