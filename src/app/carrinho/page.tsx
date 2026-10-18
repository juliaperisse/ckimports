"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrinho } from "@/components/carrinho-contexto";
import { reais, linkWhatsApp } from "@/lib/config";

export default function PaginaCarrinho() {
  const { itens, alterarQuantidade, remover, total, pronto } = useCarrinho();

  if (!pronto) {
    return <div className="mx-auto max-w-5xl px-4 py-32 text-center text-cinza">Carregando…</div>;
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-28 text-center">
        <h1 className="font-display text-4xl text-creme">Seu carrinho está vazio</h1>
        <p className="mt-4 text-cinza">Que tal dar uma olhada no catálogo?</p>
        <Link
          href="/produtos"
          className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
        >
          Ver tênis
        </Link>
      </div>
    );
  }

  const resumoWhats = linkWhatsApp(
    `Olá! Quero fechar este pedido:\n\n${itens
      .map((i) => `• ${i.nome} — tam ${i.tamanho} — ${i.quantidade}x — ${reais(i.preco * i.quantidade)}`)
      .join("\n")}\n\n*Total: ${reais(total)}*`,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl text-creme text-center">Seu carrinho</h1>
      <div className="filete-ouro w-24 mx-auto mt-5" />

      <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-10">
        <ul className="divide-y divide-ouro/10 border-y border-ouro/10">
          {itens.map((i) => (
            <li key={`${i.slug}-${i.tamanho}`} className="flex gap-4 sm:gap-5 py-6">
              <Link
                href={`/produto/${i.slug}`}
                className="relative w-24 sm:w-28 aspect-3/4 shrink-0 overflow-hidden bg-grafite"
              >
                {i.imagem && (
                  <Image src={i.imagem} alt={i.nome} fill sizes="112px" className="object-cover" />
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  href={`/produto/${i.slug}`}
                  className="font-display text-lg leading-snug text-creme hover:text-ouro transition"
                >
                  {i.nome}
                </Link>
                <p className="mt-1 text-sm text-cinza">Tamanho {i.tamanho}</p>

                <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center border border-ouro/25">
                    <button
                      onClick={() => alterarQuantidade(i.slug, i.tamanho, i.quantidade - 1)}
                      aria-label="Diminuir quantidade"
                      className="w-9 h-9 text-creme hover:text-ouro transition"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm text-creme" aria-live="polite">
                      {i.quantidade}
                    </span>
                    <button
                      onClick={() => alterarQuantidade(i.slug, i.tamanho, i.quantidade + 1)}
                      aria-label="Aumentar quantidade"
                      className="w-9 h-9 text-creme hover:text-ouro transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base text-creme">{reais(i.preco * i.quantidade)}</p>
                    <button
                      onClick={() => remover(i.slug, i.tamanho)}
                      className="mt-1 text-xs text-cinza hover:text-ouro transition"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start border border-ouro/20 p-6">
          <h2 className="font-display text-2xl text-creme">Resumo</h2>
          <div className="filete-ouro mt-4" />

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-cinza">
              <dt>Subtotal</dt>
              <dd className="text-creme">{reais(total)}</dd>
            </div>
            <div className="flex justify-between text-cinza">
              <dt>Frete</dt>
              <dd className="text-ouro">Grátis</dd>
            </div>
            <div className="flex justify-between text-cinza">
              <dt>No Pix (5% off)</dt>
              <dd className="text-creme">{reais(total * 0.95)}</dd>
            </div>
          </dl>

          <div className="filete-ouro my-5" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-cinza">Total</span>
            <span className="font-display text-3xl text-creme">{reais(total)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-cinza">
            ou 12x de {reais(total / 12)} sem juros no cartão
          </p>

          <Link
            href="/checkout"
            className="mt-6 block text-center py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
          >
            Finalizar compra
          </Link>

          <a
            href={resumoWhats}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center py-4 border border-[#25D366]/40 text-[#25D366] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-[#25D366] hover:text-preto transition"
          >
            Fechar pelo WhatsApp
          </a>

          <Link
            href="/produtos"
            className="mt-4 block text-center text-sm text-cinza hover:text-ouro transition"
          >
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
