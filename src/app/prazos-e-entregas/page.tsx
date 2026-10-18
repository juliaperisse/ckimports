import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Prazos e entregas",
  description:
    "Enviamos para todo o Brasil pelos Correios, com rastreio. Postagem em até 3 dias úteis e entrega em 1 a 7 dias úteis.",
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Prazos e entregas" subtitulo="Entrega">
      <section>
        <h2>Para onde enviamos</h2>
        <p>
          Atendemos <strong>todo o território nacional</strong>. Os envios são feitos pelos
          Correios (PAC ou Sedex), sempre com código de rastreio.
        </p>
      </section>

      <section>
        <h2>Prazo</h2>
        <ul>
          <li>
            <strong>Postagem:</strong> seu pedido é postado em até 3 dias úteis depois da
            confirmação do pagamento.
          </li>
          <li>
            <strong>Entrega:</strong> de 1 a 7 dias úteis a partir da postagem, variando
            conforme a sua região.
          </li>
          <li>
            <strong>Pix</strong> costuma confirmar em minutos. <strong>Boleto</strong> pode
            levar até 3 dias úteis para compensar — o prazo começa a contar só depois disso.
          </li>
        </ul>
      </section>

      <section>
        <h2>Frete</h2>
        <p>
          <strong>Frete grátis</strong> para todo o Brasil nos produtos marcados no site. Não
          há custo adicional no checkout.
        </p>
      </section>

      <section>
        <h2>Rastreamento</h2>
        <p>
          Assim que o pedido é coletado pelos Correios você recebe por e-mail o código de
          rastreio e o link para acompanhar. Se não encontrar a mensagem, confira a caixa de
          spam ou promoções — e, se ainda assim não achar, é só chamar no WhatsApp{" "}
          {SITE.whatsapp.exibicao}.
        </p>
      </section>

      <section>
        <h2>Taxas e impostos</h2>
        <p>
          <strong>Você não paga nada além do valor da compra.</strong> Todas as taxas e
          impostos de importação já são quitados por nós antes da postagem.
        </p>
      </section>
    </PaginaTexto>
  );
}
