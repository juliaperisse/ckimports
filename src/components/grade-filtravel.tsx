"use client";

import { useMemo, useState } from "react";
import CartaoProduto from "./cartao-produto";
import { desconto, type Produto } from "@/lib/catalogo";
import { reais } from "@/lib/config";

type Ordem = "relevancia" | "menor-preco" | "maior-preco" | "desconto";

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "relevancia", rotulo: "Relevância" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "desconto", rotulo: "Maior desconto" },
];

export default function GradeFiltravel({
  produtos,
  marcas,
  tamanhos,
}: {
  produtos: Produto[];
  marcas: string[];
  tamanhos: string[];
}) {
  const [busca, setBusca] = useState("");
  const [marca, setMarca] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [ordem, setOrdem] = useState<Ordem>("relevancia");
  const [visiveis, setVisiveis] = useState(24);

  const filtrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let lista = produtos.filter((p) => {
      if (marca && p.marca !== marca) return false;
      if (tamanho && !p.tamanhos.includes(tamanho)) return false;
      if (!termo) return true;
      const alvo = `${p.name} ${p.marca} ${p.colecoes.join(" ")}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return termo.split(/\s+/).every((t) => alvo.includes(t));
    });

    if (ordem === "menor-preco") lista = [...lista].sort((a, b) => a.price - b.price);
    if (ordem === "maior-preco") lista = [...lista].sort((a, b) => b.price - a.price);
    if (ordem === "desconto") lista = [...lista].sort((a, b) => desconto(b) - desconto(a));
    return lista;
  }, [produtos, busca, marca, tamanho, ordem]);

  const mostrando = filtrados.slice(0, visiveis);
  const temFiltro = Boolean(busca || marca || tamanho);

  const limpar = () => {
    setBusca("");
    setMarca(null);
    setTamanho(null);
    setVisiveis(24);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cinza"
              width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setVisiveis(24);
              }}
              placeholder="Buscar por modelo, cor ou marca…"
              aria-label="Buscar produtos"
              className="w-full bg-grafite border border-ouro/15 pl-11 pr-4 py-3.5 text-sm text-creme placeholder:text-cinza focus:outline-none focus:border-ouro/60 transition"
            />
          </div>

          <select
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as Ordem)}
            aria-label="Ordenar por"
            className="bg-grafite border border-ouro/15 px-4 py-3.5 text-sm text-creme focus:outline-none focus:border-ouro/60 transition"
          >
            {ORDENS.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </div>

        {marcas.length > 1 && (
          <Filtro rotulo="Marca">
            <Pilula ativo={!marca} aoClicar={() => setMarca(null)}>
              Todas
            </Pilula>
            {marcas.map((m) => (
              <Pilula key={m} ativo={marca === m} aoClicar={() => setMarca(marca === m ? null : m)}>
                {m}
              </Pilula>
            ))}
          </Filtro>
        )}

        <Filtro rotulo="Tamanho">
          <Pilula ativo={!tamanho} aoClicar={() => setTamanho(null)}>
            Todos
          </Pilula>
          {tamanhos.map((t) => (
            <Pilula
              key={t}
              ativo={tamanho === t}
              aoClicar={() => setTamanho(tamanho === t ? null : t)}
            >
              {t}
            </Pilula>
          ))}
        </Filtro>

        <div className="flex items-center justify-between text-sm text-cinza border-t border-ouro/10 pt-4">
          <p>
            {filtrados.length}{" "}
            {filtrados.length === 1 ? "produto encontrado" : "produtos encontrados"}
            {filtrados.length > 0 && (
              <span className="hidden sm:inline">
                {" "}· a partir de{" "}
                <span className="text-creme">
                  {reais(Math.min(...filtrados.map((p) => p.price)))}
                </span>
              </span>
            )}
          </p>
          {temFiltro && (
            <button onClick={limpar} className="text-ouro hover:text-ouro-claro transition">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {mostrando.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-creme">Nada encontrado</p>
          <p className="mt-2 text-sm text-cinza">
            Tente outro termo ou{" "}
            <button onClick={limpar} className="text-ouro hover:underline">
              limpe os filtros
            </button>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {mostrando.map((p, i) => (
              <CartaoProduto key={p.slug} produto={p} prioridade={i < 4} />
            ))}
          </div>

          {visiveis < filtrados.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisiveis((v) => v + 24)}
                className="px-10 py-4 border border-ouro/40 text-ouro text-sm tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
              >
                Carregar mais ({filtrados.length - visiveis})
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Filtro({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 pt-2 text-[10px] tracking-[0.2em] text-ouro/70 uppercase w-16">
        {rotulo}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pilula({
  ativo,
  aoClicar,
  children,
}: {
  ativo: boolean;
  aoClicar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={aoClicar}
      aria-pressed={ativo}
      className={`px-3.5 py-1.5 text-xs tracking-wide border transition ${
        ativo
          ? "border-ouro bg-ouro text-preto font-medium"
          : "border-ouro/20 text-cinza hover:border-ouro/60 hover:text-creme"
      }`}
    >
      {children}
    </button>
  );
}
