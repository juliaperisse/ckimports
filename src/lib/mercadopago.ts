/**
 * Cliente mínimo da API do Mercado Pago via fetch.
 * Usamos Checkout Pro: o cliente paga numa página do próprio Mercado Pago,
 * então nenhum dado de cartão passa pelo nosso servidor.
 */
import type { Comprador, ItemValidado } from "./pedido";

const API = "https://api.mercadopago.com";

function token() {
  const t = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!t) throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  return t;
}

export function mercadoPagoConfigurado() {
  return Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN);
}

type Preferencia = {
  id: string;
  init_point: string;
  sandbox_init_point: string;
};

export async function criarPreferencia(opcoes: {
  itens: ItemValidado[];
  comprador: Comprador;
  referencia: string;
  urlBase: string;
}): Promise<Preferencia> {
  const { itens, comprador, referencia, urlBase } = opcoes;
  const [primeiroNome, ...resto] = comprador.nome.split(/\s+/);

  const corpo = {
    external_reference: referencia,
    items: itens.map((i) => ({
      id: `${i.slug}-${i.tamanho}`,
      title: `${i.nome} — Tam ${i.tamanho}`,
      quantity: i.quantidade,
      unit_price: i.preco,
      currency_id: "BRL",
      picture_url: i.imagem ? `${urlBase}${i.imagem}` : undefined,
    })),
    payer: {
      name: primeiroNome,
      surname: resto.join(" ") || primeiroNome,
      email: comprador.email,
      phone: {
        area_code: comprador.telefone.slice(0, 2),
        number: comprador.telefone.slice(2),
      },
      identification: { type: "CPF", number: comprador.cpf },
      address: {
        zip_code: comprador.cep,
        street_name: comprador.rua,
        street_number: comprador.numero,
      },
    },
    shipments: {
      mode: "not_specified",
      receiver_address: {
        zip_code: comprador.cep,
        street_name: comprador.rua,
        street_number: comprador.numero,
        city_name: comprador.cidade,
        state_name: comprador.uf,
      },
    },
    back_urls: {
      success: `${urlBase}/pedido/sucesso?ref=${referencia}`,
      pending: `${urlBase}/pedido/pendente?ref=${referencia}`,
      failure: `${urlBase}/pedido/erro?ref=${referencia}`,
    },
    auto_return: "approved",
    notification_url: `${urlBase}/api/webhooks/mercadopago`,
    statement_descriptor: "CKIMPORTS",
    payment_methods: { installments: 12 },
    metadata: {
      referencia,
      cliente: comprador.nome,
      telefone: comprador.telefone,
      endereco: `${comprador.rua}, ${comprador.numero}${
        comprador.complemento ? ` - ${comprador.complemento}` : ""
      } — ${comprador.bairro}, ${comprador.cidade}/${comprador.uf} — CEP ${comprador.cep}`,
      itens: itens
        .map((i) => `${i.quantidade}x ${i.nome} (tam ${i.tamanho})`)
        .join(" | "),
    },
  };

  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": referencia,
    },
    body: JSON.stringify(corpo),
  });

  if (!r.ok) {
    const detalhe = await r.text();
    console.error("Mercado Pago recusou a preferência:", r.status, detalhe);
    throw new Error("Não foi possível iniciar o pagamento.");
  }
  return r.json();
}

export type Pagamento = {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  payment_method_id: string;
  payment_type_id: string;
  external_reference: string | null;
  date_approved: string | null;
  payer?: { email?: string; first_name?: string; last_name?: string };
  metadata?: Record<string, string>;
};

export async function buscarPagamento(id: string): Promise<Pagamento | null> {
  const r = await fetch(`${API}/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (!r.ok) {
    console.error("Falha ao consultar pagamento", id, r.status);
    return null;
  }
  return r.json();
}
