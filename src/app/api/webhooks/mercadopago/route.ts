import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { avisarVenda } from "@/lib/email";
import { buscarPagamento } from "@/lib/mercadopago";

/**
 * Webhook do Mercado Pago.
 * Confere a assinatura antes de confiar no aviso e sempre reconsulta o pagamento
 * na API — o corpo da notificação sozinho não é fonte de verdade.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const bruto = await req.text();

  let corpo: { type?: string; action?: string; data?: { id?: string } };
  try {
    corpo = JSON.parse(bruto || "{}");
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  const idPagamento = String(corpo.data?.id ?? url.searchParams.get("data.id") ?? "");
  const tipo = corpo.type ?? url.searchParams.get("type") ?? "";

  if (!assinaturaValida(req, url, idPagamento)) {
    console.warn("Webhook com assinatura inválida foi ignorado.");
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  // Só pagamentos interessam; os demais eventos são reconhecidos e descartados.
  if (tipo !== "payment" || !idPagamento) {
    return NextResponse.json({ ok: true });
  }

  const pagamento = await buscarPagamento(idPagamento);
  if (!pagamento) {
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return NextResponse.json({ erro: "pagamento não encontrado" }, { status: 500 });
  }

  if (pagamento.status === "approved") {
    await avisarVenda(pagamento);
  } else {
    console.info("Pagamento ainda não aprovado", {
      id: pagamento.id,
      status: pagamento.status,
      detalhe: pagamento.status_detail,
    });
  }

  return NextResponse.json({ ok: true });
}

function assinaturaValida(req: Request, url: URL, idPagamento: string) {
  const segredo = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  // Sem segredo configurado não há como verificar: recusamos em produção
  // em vez de aceitar avisos de origem desconhecida.
  if (!segredo) {
    if (process.env.NODE_ENV === "production") {
      console.error("MERCADO_PAGO_WEBHOOK_SECRET não configurado — webhook recusado.");
      return false;
    }
    console.warn("MERCADO_PAGO_WEBHOOK_SECRET ausente (ok em desenvolvimento).");
    return true;
  }

  const assinatura = req.headers.get("x-signature");
  const idRequisicao = req.headers.get("x-request-id") ?? "";
  if (!assinatura) return false;

  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => {
      const [k, ...v] = p.split("=");
      return [k.trim(), v.join("=").trim()];
    }),
  );
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;

  // O Mercado Pago monta o manifesto nesta ordem exata.
  const id = idPagamento || url.searchParams.get("data.id") || "";
  const manifesto = `id:${id.toLowerCase()};request-id:${idRequisicao};ts:${ts};`;
  const esperado = createHmac("sha256", segredo).update(manifesto).digest("hex");

  const a = Buffer.from(esperado, "hex");
  const b = Buffer.from(v1, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
