import type { Metadata } from "next";
import GradeFiltravel from "@/components/grade-filtravel";
import { MARCAS, PRODUTOS, TAMANHOS } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Todos os tênis",
  description:
    "Catálogo completo de tênis importados: Nike, Adidas, New Balance, Mizuno, On e chuteiras. Frete grátis para todo o Brasil.",
};

export default function PaginaProdutos() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">Catálogo</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-creme">Todos os tênis</h1>
        <div className="filete-ouro w-24 mx-auto mt-5" />
        <p className="mt-5 text-cinza">
          {PRODUTOS.length} modelos disponíveis com frete grátis para todo o Brasil.
        </p>
      </header>

      <GradeFiltravel
        produtos={PRODUTOS}
        marcas={MARCAS.map((m) => m.nome)}
        tamanhos={TAMANHOS}
      />
    </div>
  );
}
