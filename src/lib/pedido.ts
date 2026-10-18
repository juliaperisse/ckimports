import { produto } from "./catalogo";

export type ItemPedido = { slug: string; tamanho: string; quantidade: number };

export type Comprador = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type ItemValidado = {
  slug: string;
  nome: string;
  tamanho: string;
  quantidade: number;
  preco: number;
  imagem: string;
};

/**
 * Revalida o carrinho recebido do navegador contra o catálogo do servidor.
 * O preço NUNCA vem do cliente — é sempre relido daqui.
 */
export function validarCarrinho(itens: unknown): ItemValidado[] {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error("Carrinho vazio.");
  }
  if (itens.length > 50) {
    throw new Error("Carrinho com itens demais.");
  }

  return itens.map((bruto) => {
    const item = bruto as Partial<ItemPedido>;
    const p = produto(String(item.slug ?? ""));
    if (!p) throw new Error(`Produto não encontrado: ${item.slug}`);

    const tamanho = String(item.tamanho ?? "");
    const disponivel = p.sizes.find((t) => t.size === tamanho && t.available);
    if (!disponivel) {
      throw new Error(`Tamanho ${tamanho || "(não informado)"} indisponível para ${p.name}.`);
    }

    const quantidade = Math.floor(Number(item.quantidade));
    if (!Number.isFinite(quantidade) || quantidade < 1 || quantidade > 10) {
      throw new Error(`Quantidade inválida para ${p.name}.`);
    }

    return {
      slug: p.slug,
      nome: p.name,
      tamanho,
      quantidade,
      preco: p.price,
      imagem: p.images[0] ?? "",
    };
  });
}

export function totalDo(itens: ItemValidado[]) {
  return itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
}

const apenasDigitos = (s: string) => s.replace(/\D/g, "");

export function validarComprador(bruto: unknown): Comprador {
  const d = (bruto ?? {}) as Record<string, unknown>;
  const texto = (chave: string, max = 120) => String(d[chave] ?? "").trim().slice(0, max);

  const comprador: Comprador = {
    nome: texto("nome"),
    email: texto("email"),
    telefone: apenasDigitos(texto("telefone")),
    cpf: apenasDigitos(texto("cpf")),
    cep: apenasDigitos(texto("cep")),
    rua: texto("rua"),
    numero: texto("numero", 20),
    complemento: texto("complemento", 60) || undefined,
    bairro: texto("bairro"),
    cidade: texto("cidade"),
    uf: texto("uf", 2).toUpperCase(),
  };

  const faltando: string[] = [];
  if (comprador.nome.split(/\s+/).length < 2) faltando.push("nome completo");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(comprador.email)) faltando.push("e-mail válido");
  if (comprador.telefone.length < 10) faltando.push("telefone com DDD");
  if (comprador.cpf.length !== 11) faltando.push("CPF");
  if (comprador.cep.length !== 8) faltando.push("CEP");
  if (!comprador.rua) faltando.push("rua");
  if (!comprador.numero) faltando.push("número");
  if (!comprador.bairro) faltando.push("bairro");
  if (!comprador.cidade) faltando.push("cidade");
  if (comprador.uf.length !== 2) faltando.push("estado");

  if (faltando.length) {
    throw new Error(`Preencha corretamente: ${faltando.join(", ")}.`);
  }
  return comprador;
}

/** Código curto e legível para o cliente citar no WhatsApp. */
export function gerarReferencia() {
  const agora = new Date();
  const data = agora.toISOString().slice(2, 10).replace(/-/g, "");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CK-${data}-${aleatorio}`;
}
