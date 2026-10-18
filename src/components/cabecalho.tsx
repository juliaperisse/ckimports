"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useCarrinho } from "./carrinho-contexto";
import { MARCAS } from "@/lib/catalogo";
import { SITE } from "@/lib/config";

const LINKS = [
  { href: "/produtos", rotulo: "Todos os tênis" },
  ...MARCAS.slice(0, 5).map((m) => ({ href: `/marca/${m.slug}`, rotulo: m.nome })),
  { href: "/guia-de-medidas", rotulo: "Guia de medidas" },
  { href: "/contato", rotulo: "Contato" },
];

export default function Cabecalho() {
  const { quantidadeTotal, pronto } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const rolou = useRolagem();
  const caminho = usePathname();
  const fechar = () => setAberto(false);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
      <div className="bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-center text-[11px] sm:text-xs font-medium tracking-wider py-2 px-4 uppercase">
        Frete grátis para todo o Brasil · Parcele em até 12x
      </div>

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          rolou ? "bg-preto/95 backdrop-blur-md border-b border-ouro/20" : "bg-preto"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-4">
            <button
              onClick={() => setAberto((v) => !v)}
              className="lg:hidden p-2 -ml-2 text-creme hover:text-ouro transition"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={aberto}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {aberto ? (
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <Image
                src="/logo-ck.jpg"
                alt=""
                width={48}
                height={48}
                priority
                className="rounded-full ring-1 ring-ouro/40 group-hover:ring-ouro transition"
              />
              <span className="hidden sm:block leading-none">
                <span className="block font-display text-2xl tracking-[0.2em] texto-ouro">CK</span>
                <span className="block text-[9px] tracking-[0.35em] text-cinza uppercase mt-0.5">
                  Importadora
                </span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={fechar}
                  className={`relative py-1 transition hover:text-ouro ${
                    caminho === l.href ? "text-ouro" : "text-creme/80"
                  }`}
                >
                  {l.rotulo}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/produtos"
                className="p-2.5 text-creme/80 hover:text-ouro transition"
                aria-label="Buscar produtos"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </Link>

              <Link
                href="/carrinho"
                className="relative p-2.5 text-creme/80 hover:text-ouro transition"
                aria-label={`Carrinho${pronto && quantidadeTotal ? ` com ${quantidadeTotal} item(ns)` : ""}`}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinejoin="round" />
                  <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" />
                </svg>
                {pronto && quantidadeTotal > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-ouro text-preto text-[10px] font-bold">
                    {quantidadeTotal}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition ${
          aberto ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-preto/80 backdrop-blur-sm transition-opacity ${
            aberto ? "opacity-100" : "opacity-0"
          }`}
          onClick={fechar}
        />
        <nav
          className={`absolute left-0 top-0 bottom-0 w-[82%] max-w-sm bg-carvao border-r border-ouro/20 p-6 pt-8 overflow-y-auto transition-transform duration-300 ${
            aberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="font-display text-xs tracking-[0.3em] text-cinza uppercase mb-5">Navegar</p>
          <div className="filete-ouro mb-5" />
          <ul className="space-y-1">
            {[{ href: "/", rotulo: "Início" }, ...LINKS].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={fechar}
                  className="block py-3 text-lg font-display text-creme hover:text-ouro transition"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          <div className="filete-ouro my-6" />
          <a
            href={`https://wa.me/${SITE.whatsapp.numero}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3.5 border border-ouro/50 text-ouro text-sm tracking-wider uppercase hover:bg-ouro hover:text-preto transition"
          >
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}

/** Observa a rolagem fora do React para não disparar setState dentro de efeito. */
function useRolagem() {
  return useSyncExternalStore(
    (aoMudar) => {
      window.addEventListener("scroll", aoMudar, { passive: true });
      return () => window.removeEventListener("scroll", aoMudar);
    },
    () => window.scrollY > 8,
    () => false,
  );
}
