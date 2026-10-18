"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCarrinho } from "./carrinho-contexto";
import { linkWhatsApp } from "@/lib/config";

export default function RetornoPedido({
  variante,
  referencia,
}: {
  variante: "sucesso" | "pendente" | "erro";
  referencia?: string;
}) {
  const { limpar } = useCarrinho();

  // Pagamento aprovado ou aguardando compensação: o carrinho já cumpriu seu papel.
  useEffect(() => {
    if (variante !== "erro") limpar();
  }, [variante, limpar]);

  const conteudo = {
    sucesso: {
      emoji: "✓",
      titulo: "Pagamento aprovado!",
      texto:
        "Recebemos seu pedido e já começamos a preparar o envio. Você vai receber o código de rastreio no e-mail e no WhatsApp.",
      whats: "Olá! Acabei de fazer um pedido no site",
    },
    pendente: {
      emoji: "⏳",
      titulo: "Pagamento em processamento",
      texto:
        "Seu pagamento está sendo confirmado. Boleto pode levar até 3 dias úteis; Pix costuma cair em minutos. Assim que confirmar, a gente despacha.",
      whats: "Olá! Meu pagamento está pendente, queria confirmar o pedido",
    },
    erro: {
      emoji: "✕",
      titulo: "O pagamento não foi concluído",
      texto:
        "Nada foi cobrado e seu carrinho continua salvo. Você pode tentar de novo ou fechar o pedido direto com a gente no WhatsApp.",
      whats: "Olá! Tive um problema no pagamento do site e quero finalizar por aqui",
    },
  }[variante];

  const mensagem = referencia
    ? `${conteudo.whats} (pedido ${referencia}).`
    : `${conteudo.whats}.`;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div
        className={`mx-auto grid place-items-center w-20 h-20 rounded-full text-3xl ${
          variante === "sucesso"
            ? "bg-ouro text-preto"
            : "border border-ouro/40 text-ouro"
        }`}
      >
        {conteudo.emoji}
      </div>

      <h1 className="mt-8 font-display text-4xl text-creme">{conteudo.titulo}</h1>
      <div className="filete-ouro w-24 mx-auto mt-5" />
      <p className="mt-6 text-cinza leading-relaxed">{conteudo.texto}</p>

      {referencia && (
        <p className="mt-6 inline-block border border-ouro/30 px-5 py-2.5 text-sm">
          <span className="text-cinza">Pedido </span>
          <span className="text-ouro font-medium tracking-wider">{referencia}</span>
        </p>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={linkWhatsApp(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
        >
          Falar no WhatsApp
        </a>
        <Link
          href={variante === "erro" ? "/carrinho" : "/produtos"}
          className="px-8 py-4 border border-ouro/40 text-ouro text-sm font-semibold tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
        >
          {variante === "erro" ? "Voltar ao carrinho" : "Continuar comprando"}
        </Link>
      </div>
    </div>
  );
}
