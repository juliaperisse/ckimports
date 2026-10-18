import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a CK Importadora coleta, usa e protege os seus dados pessoais.",
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Política de privacidade" subtitulo="Privacidade">
      <p>
        Esta política explica quais dados a <strong>{SITE.nome}</strong> coleta, por que
        coleta e o que você pode exigir da gente. Ela segue a{" "}
        <strong>Lei Geral de Proteção de Dados (Lei 13.709/2018)</strong>.
      </p>

      <section>
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Dados de cadastro e entrega:</strong> nome, e-mail, telefone, CPF e
            endereço — informados por você no checkout.
          </li>
          <li>
            <strong>Dados do pedido:</strong> produtos, tamanhos, valores e status do
            pagamento.
          </li>
          <li>
            <strong>Dados de navegação:</strong> páginas visitadas e informações técnicas do
            navegador.
          </li>
        </ul>
        <p className="mt-3">
          <strong>Não coletamos nem armazenamos dados de cartão de crédito.</strong> Esses
          dados são digitados direto no ambiente do Mercado Pago.
        </p>
      </section>

      <section>
        <h2>Por que usamos</h2>
        <ul>
          <li>processar seu pedido e o pagamento;</li>
          <li>emitir nota e despachar a mercadoria pelos Correios;</li>
          <li>enviar o código de rastreio e dar suporte;</li>
          <li>cumprir obrigações fiscais e legais.</li>
        </ul>
      </section>

      <section>
        <h2>Com quem compartilhamos</h2>
        <p>Só com quem é necessário para a compra acontecer:</p>
        <ul>
          <li>
            <strong>Mercado Pago</strong> — processamento do pagamento;
          </li>
          <li>
            <strong>Correios</strong> — entrega do pedido;
          </li>
          <li>autoridades, quando houver exigência legal.</li>
        </ul>
        <p className="mt-3">
          <strong>Nunca vendemos seus dados</strong> nem os repassamos para fins publicitários
          de terceiros.
        </p>
      </section>

      <section>
        <h2>Por quanto tempo guardamos</h2>
        <p>
          Mantemos os dados do pedido pelo prazo exigido pela legislação fiscal (5 anos). Você
          pode pedir a exclusão do que não estiver sujeito a essa obrigação.
        </p>
      </section>

      <section>
        <h2>Seus direitos</h2>
        <p>A qualquer momento você pode pedir para:</p>
        <ul>
          <li>confirmar e acessar os dados que temos sobre você;</li>
          <li>corrigir dados incompletos ou desatualizados;</li>
          <li>excluir dados desnecessários ou tratados fora da lei;</li>
          <li>revogar o consentimento.</li>
        </ul>
        <p className="mt-3">
          Para exercer qualquer um deles, chame no WhatsApp {SITE.whatsapp.exibicao}. A gente
          responde em até 15 dias.
        </p>
      </section>

      <section>
        <h2>Segurança</h2>
        <p>
          O site roda sobre conexão criptografada (HTTPS/SSL) e o pagamento acontece dentro do
          ambiente certificado do Mercado Pago.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Usamos armazenamento local apenas para manter seu carrinho entre visitas. Você pode
          limpar isso a qualquer momento nas configurações do navegador.
        </p>
      </section>
    </PaginaTexto>
  );
}
