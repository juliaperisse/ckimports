import { reais } from "./config";
import type { Pagamento } from "./mercadopago";

/** Envia o aviso de venda por e-mail (Resend). Nunca derruba o webhook se falhar. */
export async function avisarVenda(pagamento: Pagamento) {
  const chave = process.env.RESEND_API_KEY;
  const destino = process.env.EMAIL_VENDAS;
  const remetente = process.env.EMAIL_REMETENTE ?? "CK Importadora <onboarding@resend.dev>";

  if (!chave || !destino) {
    console.warn(
      "Venda aprovada, mas o e-mail não foi enviado: configure RESEND_API_KEY e EMAIL_VENDAS.",
      { referencia: pagamento.external_reference, valor: pagamento.transaction_amount },
    );
    return;
  }

  const m = pagamento.metadata ?? {};
  const ref = pagamento.external_reference ?? "sem referência";
  const linha = (rotulo: string, valor?: string) =>
    valor
      ? `<tr><td style="padding:6px 14px 6px 0;color:#8a8279;white-space:nowrap">${rotulo}</td><td style="padding:6px 0;color:#1a1a1a">${valor}</td></tr>`
      : "";

  const html = `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:28px">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a8763a">CK Importadora</p>
  <h1 style="margin:0 0 6px;font-size:24px;color:#1a1a1a">Nova venda aprovada 🎉</h1>
  <p style="margin:0 0 22px;font-size:28px;font-weight:700;color:#1a7f37">${reais(pagamento.transaction_amount)}</p>
  <table style="border-collapse:collapse;font-size:14px;width:100%">
    ${linha("Pedido", ref)}
    ${linha("Cliente", m.cliente)}
    ${linha("E-mail", pagamento.payer?.email)}
    ${linha("Telefone", m.telefone)}
    ${linha("Itens", m.itens)}
    ${linha("Endereço", m.endereco)}
    ${linha("Pagamento", `${pagamento.payment_type_id} / ${pagamento.payment_method_id}`)}
    ${linha("ID Mercado Pago", String(pagamento.id))}
  </table>
  <p style="margin:24px 0 0;font-size:13px;color:#8a8279">
    Confira o pedido no painel do Mercado Pago antes de despachar.
  </p>
</div>`.trim();

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente,
        to: destino.split(",").map((e) => e.trim()),
        subject: `💰 Venda ${reais(pagamento.transaction_amount)} — ${ref}`,
        html,
        reply_to: pagamento.payer?.email,
      }),
    });
    if (!r.ok) console.error("Resend recusou o e-mail:", r.status, await r.text());
  } catch (erro) {
    console.error("Falha ao enviar e-mail de venda:", erro);
  }
}
