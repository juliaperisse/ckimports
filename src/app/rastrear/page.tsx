import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Rastrear pedido",
  description: "Acompanhe a entrega do seu pedido pelos Correios.",
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Rastrear pedido" subtitulo="Entrega">
      <section>
        <h2>Onde encontrar seu código</h2>
        <p>
          Assim que os Correios coletam seu pedido, enviamos o código de rastreio para o
          e-mail cadastrado na compra. Se não encontrar, confira a caixa de{" "}
          <strong>spam</strong> ou <strong>promoções</strong>.
        </p>
      </section>

      <section>
        <h2>Acompanhar</h2>
        <p>Com o código em mãos, consulte direto no site dos Correios:</p>
        <p className="mt-4">
          <a
            href="https://rastreamento.correios.com.br/app/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 border border-ouro/40 text-ouro text-sm font-semibold tracking-[0.15em] uppercase !no-underline hover:bg-ouro hover:text-preto transition"
          >
            Rastrear nos Correios
          </a>
        </p>
      </section>

      <section className="border border-ouro/25 p-6 text-center">
        <h2>Não recebeu o código?</h2>
        <p className="mt-2">
          Manda o número do pedido (começa com <strong>CK-</strong>) no WhatsApp que a gente
          reenvia na hora.
        </p>
        <a
          href={linkWhatsApp("Olá! Quero o código de rastreio do meu pedido CK-")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-8 py-3.5 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase !no-underline"
        >
          {SITE.whatsapp.exibicao}
        </a>
      </section>
    </PaginaTexto>
  );
}
