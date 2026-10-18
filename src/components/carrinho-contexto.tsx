"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { lojaCarrinho } from "@/lib/loja-local";

export type ItemCarrinho = {
  slug: string;
  nome: string;
  preco: number;
  tamanho: string;
  imagem: string;
  quantidade: number;
};

/**
 * Mantido como "Provider" por conveniência de leitura no layout,
 * mas o estado mora em lojaCarrinho — não há contexto a propagar.
 */
export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const mesmo = (i: ItemCarrinho, slug: string, tamanho: string) =>
  i.slug === slug && i.tamanho === tamanho;

export function useCarrinho() {
  const itens = useSyncExternalStore(
    lojaCarrinho.inscrever,
    lojaCarrinho.instantaneo,
    lojaCarrinho.instantaneoServidor,
  );

  // Enquanto o servidor e o primeiro render não tiverem o carrinho real,
  // `pronto` fica falso para não piscar um contador errado.
  const pronto = useSyncExternalStore(
    lojaCarrinho.inscrever,
    () => true,
    () => false,
  );

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "quantidade">, quantidade = 1) => {
      const atual = lojaCarrinho.instantaneo();
      const i = atual.findIndex((x) => mesmo(x, item.slug, item.tamanho));
      if (i === -1) {
        lojaCarrinho.definir([...atual, { ...item, quantidade }]);
        return;
      }
      const copia = [...atual];
      copia[i] = { ...copia[i], quantidade: copia[i].quantidade + quantidade };
      lojaCarrinho.definir(copia);
    },
    [],
  );

  const remover = useCallback((slug: string, tamanho: string) => {
    lojaCarrinho.definir(lojaCarrinho.instantaneo().filter((x) => !mesmo(x, slug, tamanho)));
  }, []);

  const alterarQuantidade = useCallback((slug: string, tamanho: string, quantidade: number) => {
    const atual = lojaCarrinho.instantaneo();
    lojaCarrinho.definir(
      quantidade <= 0
        ? atual.filter((x) => !mesmo(x, slug, tamanho))
        : atual.map((x) => (mesmo(x, slug, tamanho) ? { ...x, quantidade } : x)),
    );
  }, []);

  const limpar = useCallback(() => lojaCarrinho.definir([]), []);

  return useMemo(
    () => ({
      itens,
      pronto,
      adicionar,
      remover,
      alterarQuantidade,
      limpar,
      total: itens.reduce((s, i) => s + i.preco * i.quantidade, 0),
      quantidadeTotal: itens.reduce((s, i) => s + i.quantidade, 0),
    }),
    [itens, pronto, adicionar, remover, alterarQuantidade, limpar],
  );
}
