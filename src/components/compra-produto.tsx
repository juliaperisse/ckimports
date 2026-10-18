"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "./carrinho-contexto";
import type { Produto } from "@/lib/catalogo";
import { reais, linkWhatsApp, SITE } from "@/lib/config";

export default function CompraProduto({ produto: p }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const router = useRouter();
  const [foto, setFoto] = useState(0);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [erro, setErro] = useState(false);
  const [adicionado, setAdicionado] = useState(false);

  const disponiveis = p.sizes.filter((t) => t.available);
  const parcela = p.price / 12;
  const pix = p.price * 0.95;

  function aoAdicionar(irParaCarrinho = false) {
    if (!tamanho) {
      setErro(true);
      return;
    }
    adicionar({
      slug: p.slug,
      nome: p.name,
      preco: p.price,
      tamanho,
      imagem: p.images[0] ?? "",
    });
    if (irParaCarrinho) {
      router.push("/carrinho");
      return;
    }
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2200);
  }

  const mensagemWhats = linkWhatsApp(
    `Olá! Tenho interesse neste tênis:\n\n*${p.name}*\n${
      tamanho ? `Tamanho: ${tamanho}\n` : ""
    }Valor: ${reais(p.price)}\n\n${SITE.url}/produto/${p.slug}`,
  );

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Galeria */}
      <div className="mx-auto w-full max-w-md lg:max-w-none lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-3/4 overflow-hidden bg-grafite">
          {p.images[foto] ? (
            <Image
              src={p.images[foto]}
              alt={`${p.name} — foto ${foto + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-cinza">sem foto</div>
          )}
        </div>

        {p.images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {p.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setFoto(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === foto}
                className={`relative aspect-square overflow-hidden bg-grafite border transition ${
                  i === foto ? "border-ouro" : "border-transparent hover:border-ouro/40"
                }`}
              >
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informações e compra */}
      <div>
        <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">{p.marca}</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl leading-tight text-creme">
          {p.name}
        </h1>

        <div className="mt-6 flex items-baseline flex-wrap gap-x-3 gap-y-1">
          <span className="text-3xl font-medium text-creme">{reais(p.price)}</span>
          {p.compare_at && p.compare_at > p.price && (
            <span className="text-lg text-cinza line-through">{reais(p.compare_at)}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-cinza">
          ou <span className="text-ouro">{reais(pix)}</span> no Pix (5% de desconto)
        </p>
        <p className="text-sm text-cinza">em até 12x de {reais(parcela)} no cartão</p>

        <div className="filete-ouro my-8" />

        {/* Tamanhos */}
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[11px] tracking-[0.25em] text-ouro uppercase">
              Tamanho {tamanho && <span className="text-creme">· {tamanho}</span>}
            </h2>
            <a href="/guia-de-medidas" className="text-xs text-cinza hover:text-ouro transition">
              Guia de medidas
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {p.sizes.map((t) => (
              <button
                key={t.size}
                disabled={!t.available}
                onClick={() => {
                  setTamanho(t.size);
                  setErro(false);
                }}
                aria-pressed={tamanho === t.size}
                className={`min-w-14 px-4 py-3 text-sm border transition ${
                  !t.available
                    ? "border-fumaca text-cinza/40 line-through cursor-not-allowed"
                    : tamanho === t.size
                      ? "border-ouro bg-ouro text-preto font-semibold"
                      : "border-ouro/25 text-creme hover:border-ouro"
                }`}
              >
                {t.size}
              </button>
            ))}
          </div>

          {erro && (
            <p role="alert" className="mt-3 text-sm text-ouro-claro">
              Escolha um tamanho para continuar.
            </p>
          )}
          {disponiveis.length === 0 && (
            <p className="mt-3 text-sm text-cinza">
              Sem estoque no site — fale no WhatsApp para consultar disponibilidade.
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => aoAdicionar(true)}
            className="w-full py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
          >
            Comprar agora
          </button>

          <button
            onClick={() => aoAdicionar(false)}
            className="w-full py-4 border border-ouro/40 text-ouro text-sm font-semibold tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
          >
            {adicionado ? "Adicionado ✓" : "Adicionar ao carrinho"}
          </button>

          <a
            href={mensagemWhats}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 border border-[#25D366]/40 text-[#25D366] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-[#25D366] hover:text-preto transition"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
            </svg>
            Comprar pelo WhatsApp
          </a>
        </div>

        {/* Selos */}
        <ul className="mt-8 space-y-3 text-sm text-cinza">
          <Selo>Frete grátis para todo o Brasil · {SITE.frete.prazo}</Selo>
          <Selo>Pagamento seguro via Mercado Pago (Pix, cartão e boleto)</Selo>
          <Selo>Produto importado, conferido antes do envio</Selo>
          <Selo>Dúvida na numeração? Chama no WhatsApp antes de fechar</Selo>
        </ul>

        {p.description && (
          <>
            <div className="filete-ouro my-8" />
            <h2 className="text-[11px] tracking-[0.25em] text-ouro uppercase">Descrição</h2>
            <p className="mt-4 text-sm leading-relaxed text-cinza whitespace-pre-line">
              {p.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Selo({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        className="mt-0.5 shrink-0 text-ouro"
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
