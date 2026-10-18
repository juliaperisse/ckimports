import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Dúvidas sobre frete, prazo, troca, numeração e segurança na CK Importadora.",
};

const PERGUNTAS = [
  {
    p: "Quanto custa o frete?",
    r: "Frete grátis para todo o Brasil nos produtos marcados no site. O envio é feito pelos Correios, com rastreio.",
  },
  {
    p: "Qual o prazo de entrega?",
    r: "Postamos em até 3 dias úteis após a confirmação do pagamento e a entrega leva de 1 a 7 dias úteis, dependendo da região.",
  },
  {
    p: "De onde os produtos são enviados?",
    r: "Todos os produtos de pronta entrega saem do nosso estoque em São Paulo — SP.",
  },
  {
    p: "Quais as formas de pagamento?",
    r: "Pix (com desconto), cartão de crédito em até 12x e boleto. O pagamento é processado pelo Mercado Pago.",
  },
  {
    p: "É seguro comprar no site?",
    r: "Sim. O site usa conexão criptografada (SSL) e o pagamento acontece dentro do ambiente do Mercado Pago — seus dados de cartão nunca passam pelo nosso servidor.",
  },
  {
    p: "Vou pagar taxa de importação?",
    r: "Não. Todas as taxas e impostos já estão inclusos e são quitados por nós antes da postagem.",
  },
  {
    p: "Qual o prazo para trocar?",
    r: "Você pode solicitar troca em até 7 dias corridos após receber, nos casos de modelo ou tamanho diferente do pedido, ou defeito de fabricação.",
  },
  {
    p: "Como acompanho meu pedido?",
    r: "Assim que o pedido é coletado pelos Correios, enviamos o código de rastreio por e-mail. Confira também a caixa de spam.",
  },
  {
    p: "Não recebi e-mail da loja. E agora?",
    r: "Olhe em spam ou promoções. Se não encontrar, chame no WhatsApp que a gente reenvia tudo na hora.",
  },
  {
    p: "Posso comprar sem usar o site?",
    r: "Pode. Manda o modelo e a numeração no WhatsApp que fechamos o pedido por lá.",
  },
];

export default function Pagina() {
  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ p, r }) => ({
      "@type": "Question",
      name: p,
      acceptedAnswer: { "@type": "Answer", text: r },
    })),
  };

  return (
    <PaginaTexto titulo="Perguntas frequentes" subtitulo="Ajuda">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <div className="divide-y divide-ouro/10 border-y border-ouro/10">
        {PERGUNTAS.map(({ p, r }) => (
          <details key={p} className="group py-5">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-creme font-display text-lg marker:content-none">
              {p}
              <span className="shrink-0 text-ouro transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 pr-8">{r}</p>
          </details>
        ))}
      </div>

      <section className="border border-ouro/25 p-6 text-center">
        <h2>Não achou sua dúvida?</h2>
        <p className="mt-2">A gente responde rápido no WhatsApp.</p>
        <a
          href={linkWhatsApp("Olá! Tenho uma dúvida sobre os produtos da CK Importadora.")}
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
