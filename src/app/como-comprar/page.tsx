import type { Metadata } from "next";
import Link from "next/link";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Como comprar",
  description: "Passo a passo para comprar na CK Importadora pelo site ou pelo WhatsApp.",
};

const PASSOS = [
  {
    titulo: "Escolha o tênis",
    texto: "Navegue pelo catálogo, abra o modelo que gostou e confira as fotos reais do produto.",
  },
  {
    titulo: "Selecione a numeração",
    texto: "Na página do produto, escolha o tamanho. Na dúvida, consulte o guia de medidas.",
  },
  {
    titulo: "Adicione ao carrinho",
    texto: "Você pode continuar comprando ou ir direto para o checkout.",
  },
  {
    titulo: "Preencha seus dados",
    texto: "Nome, e-mail, WhatsApp, CPF e endereço de entrega. O CEP preenche o resto sozinho.",
  },
  {
    titulo: "Pague com segurança",
    texto:
      "Você é levado para o ambiente do Mercado Pago e escolhe entre Pix, cartão em até 12x ou boleto.",
  },
  {
    titulo: "Acompanhe o envio",
    texto:
      "Confirmado o pagamento, postamos em até 3 dias úteis e mandamos o código de rastreio no e-mail.",
  },
];

export default function Pagina() {
  return (
    <PaginaTexto titulo="Como comprar" subtitulo="Passo a passo">
      <ol className="space-y-6 !list-none !pl-0">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="flex gap-5">
            <span className="shrink-0 grid place-items-center w-10 h-10 border border-ouro/40 font-display text-lg text-ouro">
              {i + 1}
            </span>
            <div>
              <h2 className="!text-xl !mb-1">{p.titulo}</h2>
              <p>{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="border border-ouro/25 p-6 text-center">
        <h2>Prefere comprar pelo WhatsApp?</h2>
        <p className="mt-2">
          Manda o modelo e a numeração que a gente confirma disponibilidade e fecha o pedido
          por lá mesmo.
        </p>
        <a
          href={linkWhatsApp("Olá! Quero fazer um pedido pelo WhatsApp.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-8 py-3.5 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase !no-underline"
        >
          {SITE.whatsapp.exibicao}
        </a>
      </section>

      <p className="text-center">
        <Link href="/produtos">Ver o catálogo completo →</Link>
      </p>
    </PaginaTexto>
  );
}
