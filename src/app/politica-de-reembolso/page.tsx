import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description: "Política de trocas, devoluções e reembolso da CK Importadora.",
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Trocas e devoluções" subtitulo="Política">
      <section>
        <h2>Direito de arrependimento</h2>
        <p>
          Como manda o <strong>Código de Defesa do Consumidor (art. 49)</strong>, você pode
          desistir da compra em até <strong>7 dias corridos</strong> contados do recebimento,
          sem precisar justificar. Nesse caso devolvemos o valor integral, incluindo o frete.
        </p>
      </section>

      <section>
        <h2>Troca por tamanho ou defeito</h2>
        <p>Aceitamos troca em até 7 dias corridos do recebimento quando:</p>
        <ul>
          <li>o modelo, a cor ou a numeração vieram diferentes do que você pediu;</li>
          <li>o produto apresenta defeito de fabricação ou chegou avariado.</li>
        </ul>
        <p className="mt-3">
          Nesses casos, <strong>o frete de ida e volta é por nossa conta</strong>.
        </p>
      </section>

      <section>
        <h2>Condições</h2>
        <ul>
          <li>O produto precisa estar sem sinais de uso, com etiquetas e na caixa original.</li>
          <li>Guarde a embalagem até ter certeza de que vai ficar com o tênis.</li>
          <li>
            Experimente em superfície limpa — solado marcado configura uso e inviabiliza a
            troca.
          </li>
        </ul>
      </section>

      <section>
        <h2>Como solicitar</h2>
        <ol>
          <li>
            Chame no WhatsApp {SITE.whatsapp.exibicao} em até 7 dias do recebimento, com o
            número do pedido.
          </li>
          <li>Envie fotos do produto e da embalagem.</li>
          <li>A gente confirma a solicitação e envia as instruções de postagem.</li>
        </ol>
      </section>

      <section>
        <h2>Prazo do reembolso</h2>
        <ul>
          <li>
            <strong>Pix:</strong> até 5 dias úteis depois de recebermos o produto de volta.
          </li>
          <li>
            <strong>Cartão:</strong> o estorno aparece em até duas faturas, conforme o prazo
            da operadora.
          </li>
          <li>
            <strong>Boleto:</strong> depósito em conta de mesma titularidade, em até 10 dias
            úteis.
          </li>
        </ul>
      </section>

      <p className="text-center">
        <a href={linkWhatsApp("Olá! Quero solicitar uma troca/devolução do pedido CK-")} target="_blank" rel="noopener noreferrer">
          Solicitar troca no WhatsApp →
        </a>
      </p>
    </PaginaTexto>
  );
}
