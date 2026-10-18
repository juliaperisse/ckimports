import { NextResponse } from "next/server";
import { criarPreferencia, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { gerarReferencia, totalDo, validarCarrinho, validarComprador } from "@/lib/pedido";

export async function POST(req: Request) {
  if (!mercadoPagoConfigurado()) {
    return NextResponse.json(
      {
        erro:
          "O pagamento online ainda não foi ativado. Finalize o pedido pelo WhatsApp que a gente te atende na hora.",
      },
      { status: 503 },
    );
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const { itens: itensBrutos, comprador: compradorBruto } = (corpo ?? {}) as Record<string, unknown>;

  let itens, comprador;
  try {
    itens = validarCarrinho(itensBrutos);
    comprador = validarComprador(compradorBruto);
  } catch (erro) {
    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : "Dados inválidos." },
      { status: 400 },
    );
  }

  const referencia = gerarReferencia();
  const urlBase = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  try {
    const preferencia = await criarPreferencia({ itens, comprador, referencia, urlBase });
    console.info("Checkout iniciado", {
      referencia,
      total: totalDo(itens),
      itens: itens.length,
    });
    return NextResponse.json({
      referencia,
      url: preferencia.init_point,
    });
  } catch (erro) {
    console.error("Erro ao criar preferência:", erro);
    return NextResponse.json(
      { erro: "Não conseguimos iniciar o pagamento agora. Tente de novo ou chame no WhatsApp." },
      { status: 502 },
    );
  }
}
