import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CartaoProduto from "@/components/cartao-produto";
import CompraProduto from "@/components/compra-produto";
import { PRODUTOS, paraSlug, produto, relacionados } from "@/lib/catalogo";
import { SITE } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = produto(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} — tênis ${p.marca} importado por R$ ${p.price.toFixed(2).replace(".", ",")}. Frete grátis para todo o Brasil.`,
    openGraph: { images: p.images.slice(0, 1), title: p.name },
  };
}

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const p = produto(slug);
  if (!p) notFound();

  const similares = relacionados(p, 4);

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => `${SITE.url}${i}`),
    brand: { "@type": "Brand", name: p.marca },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/produto/${p.slug}`,
      priceCurrency: "BRL",
      price: p.price,
      availability: p.sizes.some((t) => t.available)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.nome },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <nav aria-label="Você está em" className="mb-8 text-xs text-cinza">
        <Link href="/" className="hover:text-ouro transition">
          Início
        </Link>
        <span className="mx-2 text-ouro/40">/</span>
        <Link href={`/marca/${paraSlug(p.marca)}`} className="hover:text-ouro transition">
          {p.marca}
        </Link>
        <span className="mx-2 text-ouro/40">/</span>
        <span className="text-creme/70">{p.name}</span>
      </nav>

      <CompraProduto produto={p} />

      {similares.length > 0 && (
        <section className="mt-24">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">Você também pode gostar</p>
            <h2 className="mt-3 font-display text-3xl text-creme">Modelos parecidos</h2>
            <div className="filete-ouro w-24 mx-auto mt-5" />
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {similares.map((s) => (
              <CartaoProduto key={s.slug} produto={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
