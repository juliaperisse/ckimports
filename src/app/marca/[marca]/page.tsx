import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GradeFiltravel from "@/components/grade-filtravel";
import { MARCAS, TAMANHOS, porMarca } from "@/lib/catalogo";

type Props = { params: Promise<{ marca: string }> };

export function generateStaticParams() {
  return MARCAS.map((m) => ({ marca: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca } = await params;
  const encontrada = MARCAS.find((m) => m.slug === marca);
  if (!encontrada) return {};
  return {
    title: `${encontrada.nome} — ${encontrada.total} modelos`,
    description: `Tênis ${encontrada.nome} importados na CK Importadora. ${encontrada.total} modelos com frete grátis para todo o Brasil.`,
  };
}

export default async function PaginaMarca({ params }: Props) {
  const { marca } = await params;
  const encontrada = MARCAS.find((m) => m.slug === marca);
  if (!encontrada) notFound();

  const produtos = porMarca(marca);
  const tamanhos = TAMANHOS.filter((t) => produtos.some((p) => p.tamanhos.includes(t)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">Marca</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-creme">{encontrada.nome}</h1>
        <div className="filete-ouro w-24 mx-auto mt-5" />
        <p className="mt-5 text-cinza">{produtos.length} modelos disponíveis.</p>
      </header>

      <GradeFiltravel produtos={produtos} marcas={[]} tamanhos={tamanhos} />
    </div>
  );
}
