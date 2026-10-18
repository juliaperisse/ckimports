export const SITE = {
  nome: "CK Importadora",
  nomeCurto: "CK Imports",
  descricao:
    "Tênis importados de alta qualidade — Nike, Adidas, New Balance, Mizuno, On e chuteiras. Entrega para todo o Brasil.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ckimports.com.br",

  whatsapp: {
    /** Formato internacional, só dígitos — usado nos links wa.me */
    numero: "5519971501971",
    /** Formato de exibição */
    exibicao: "(19) 97150-1971",
  },

  instagram: "https://instagram.com/ckimportadora",

  /** Para onde vão os avisos de venda */
  emailVendas: process.env.EMAIL_VENDAS ?? "",

  frete: {
    /** Frete grátis acima deste valor (em reais). 0 = sempre grátis */
    gratisAcimaDe: 0,
    prazo: "1 a 7 dias úteis",
  },
} as const;

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${SITE.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

export function reais(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
