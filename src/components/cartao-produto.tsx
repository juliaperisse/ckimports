import Image from "next/image";
import Link from "next/link";
import { desconto, type Produto } from "@/lib/catalogo";
import { reais } from "@/lib/config";

export default function CartaoProduto({
  produto: p,
  prioridade = false,
}: {
  produto: Produto;
  prioridade?: boolean;
}) {
  const off = desconto(p);
  const parcela = p.price / 12;

  return (
    <Link
      href={`/produto/${p.slug}`}
      className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-ouro"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-grafite">
        {p.images[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={prioridade}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-cinza text-xs">
            sem foto
          </div>
        )}

        {/* Segunda foto no hover, quando existir */}
        {p.images[1] && (
          <Image
            src={p.images[1]}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {off > 0 && (
          <span className="absolute top-3 left-3 bg-ouro text-preto text-[10px] font-bold tracking-wider px-2 py-1">
            -{off}%
          </span>
        )}
        {p.freeShipping && (
          <span className="absolute top-3 right-3 border border-creme/30 bg-preto/60 backdrop-blur-sm text-creme text-[10px] tracking-wider px-2 py-1 uppercase">
            Frete grátis
          </span>
        )}
      </div>

      <div className="pt-4 pb-2">
        <p className="text-[10px] tracking-[0.2em] text-ouro/70 uppercase">{p.marca}</p>
        <h3 className="mt-1.5 font-display text-lg leading-snug text-creme line-clamp-2 group-hover:text-ouro transition">
          {p.name}
        </h3>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-medium text-creme">{reais(p.price)}</span>
          {p.compare_at && p.compare_at > p.price && (
            <span className="text-sm text-cinza line-through">{reais(p.compare_at)}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-cinza">
          12x de {reais(parcela)} <span className="text-ouro/60">·</span> Pix com desconto
        </p>
      </div>
    </Link>
  );
}
