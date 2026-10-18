import dados from "../../data/produtos.json";

export type Tamanho = { size: string; available: boolean };

export type Produto = {
  slug: string;
  name: string;
  price: number;
  compare_at: number | null;
  sizes: Tamanho[];
  tamanhos: string[];
  images: string[];
  description: string;
  freeShipping: boolean;
  marca: string;
  marcas: string[];
  colecao: string;
  colecoes: string[];
};

export const PRODUTOS = dados as Produto[];

const porSlug = new Map(PRODUTOS.map((p) => [p.slug, p]));

export function produto(slug: string) {
  return porSlug.get(slug);
}

/** "New Balance" -> "new-balance" */
export function paraSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type Marca = { nome: string; slug: string; total: number; capa: string };

export const MARCAS: Marca[] = (() => {
  const mapa = new Map<string, Produto[]>();
  for (const p of PRODUTOS) {
    for (const m of p.marcas) {
      if (!mapa.has(m)) mapa.set(m, []);
      mapa.get(m)!.push(p);
    }
  }
  return [...mapa.entries()]
    .filter(([nome]) => nome !== "Outros")
    .map(([nome, ps]) => ({
      nome,
      slug: paraSlug(nome),
      total: ps.length,
      capa: ps.find((p) => p.images.length)?.images[0] ?? "",
    }))
    .sort((a, b) => b.total - a.total);
})();

export function porMarca(slugMarca: string) {
  return PRODUTOS.filter((p) => p.marcas.some((m) => paraSlug(m) === slugMarca));
}

export function colecoesDaMarca(slugMarca: string) {
  const vistos = new Map<string, number>();
  for (const p of porMarca(slugMarca)) {
    for (const c of p.colecoes) vistos.set(c, (vistos.get(c) ?? 0) + 1);
  }
  return [...vistos.entries()]
    .map(([nome, total]) => ({ nome, slug: paraSlug(nome), total }))
    .sort((a, b) => b.total - a.total);
}

/** Produtos com maior desconto sobre o preço cheio. */
export function emDestaque(n = 8) {
  return [...PRODUTOS]
    .filter((p) => p.images.length > 0)
    .sort((a, b) => desconto(b) - desconto(a))
    .slice(0, n);
}

export function desconto(p: Produto) {
  if (!p.compare_at || p.compare_at <= p.price) return 0;
  return Math.round((1 - p.price / p.compare_at) * 100);
}

export function relacionados(p: Produto, n = 4) {
  const mesmaColecao = PRODUTOS.filter(
    (o) => o.slug !== p.slug && o.colecoes.some((c) => p.colecoes.includes(c)),
  );
  const mesmaMarca = PRODUTOS.filter(
    (o) => o.slug !== p.slug && o.marca === p.marca && !mesmaColecao.includes(o),
  );
  return [...mesmaColecao, ...mesmaMarca].slice(0, n);
}

/** Todos os tamanhos existentes no catálogo, em ordem numérica. */
export const TAMANHOS = [...new Set(PRODUTOS.flatMap((p) => p.tamanhos))].sort(
  (a, b) => Number(a) - Number(b),
);

export const FAIXA_PRECO = {
  min: Math.min(...PRODUTOS.map((p) => p.price)),
  max: Math.max(...PRODUTOS.map((p) => p.price)),
};
