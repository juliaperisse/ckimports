import type { ItemCarrinho } from "@/components/carrinho-contexto";

/**
 * Carrinho guardado fora do React, em localStorage.
 * Viver fora do React deixa o estado ser lido com useSyncExternalStore,
 * que resolve a hidratação sem efeito nenhum no meio do caminho.
 */
const CHAVE = "ck-carrinho";

let itens: ItemCarrinho[] = ler();
const ouvintes = new Set<() => void>();

function ler(): ItemCarrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = window.localStorage.getItem(CHAVE);
    const lido = salvo ? JSON.parse(salvo) : [];
    return Array.isArray(lido) ? lido : [];
  } catch {
    // Aba anônima ou armazenamento bloqueado: segue em memória.
    return [];
  }
}

function gravar() {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    /* sem persistência, mas a sessão continua funcionando */
  }
  for (const ouvinte of ouvintes) ouvinte();
}

export const lojaCarrinho = {
  inscrever(ouvinte: () => void) {
    ouvintes.add(ouvinte);
    // Mantém abas abertas em sincronia.
    const aoMudarEmOutraAba = (e: StorageEvent) => {
      if (e.key === CHAVE) {
        itens = ler();
        ouvinte();
      }
    };
    window.addEventListener("storage", aoMudarEmOutraAba);
    return () => {
      ouvintes.delete(ouvinte);
      window.removeEventListener("storage", aoMudarEmOutraAba);
    };
  },

  instantaneo: () => itens,

  /** No servidor o carrinho é sempre vazio — evita divergência na hidratação. */
  instantaneoServidor: (): ItemCarrinho[] => VAZIO,

  definir(proximos: ItemCarrinho[]) {
    itens = proximos;
    gravar();
  },
};

const VAZIO: ItemCarrinho[] = [];
