import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Condições de uso do site e de compra na CK Importadora.",
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Termos de uso" subtitulo="Condições">
      <section>
        <h2>1. Sobre estes termos</h2>
        <p>
          Ao navegar e comprar no site da <strong>{SITE.nome}</strong> você concorda com as
          condições abaixo. Se não concordar, não utilize o site.
        </p>
      </section>

      <section>
        <h2>2. Produtos e disponibilidade</h2>
        <p>
          Trabalhamos com tênis importados. As fotos são do produto real, mas pequenas
          variações de tonalidade podem ocorrer por conta da tela do seu aparelho. A
          disponibilidade mostrada no site é atualizada com frequência, mas um item pode
          esgotar entre a sua escolha e a confirmação do pagamento — nesse caso avisamos e
          devolvemos o valor integral.
        </p>
      </section>

      <section>
        <h2>3. Preços</h2>
        <p>
          Os preços são em reais e podem mudar sem aviso prévio. O valor que vale é o exibido
          no momento da finalização do pedido. Erros evidentes de digitação não obrigam a loja
          à venda — nesses casos cancelamos e reembolsamos integralmente.
        </p>
      </section>

      <section>
        <h2>4. Pagamento</h2>
        <p>
          O pagamento é processado pelo <strong>Mercado Pago</strong>. O pedido só é separado
          e despachado depois da confirmação do pagamento.
        </p>
      </section>

      <section>
        <h2>5. Entrega</h2>
        <p>
          Os prazos informados são estimativas que dependem dos Correios. É responsabilidade
          do cliente informar o endereço corretamente — reenvios causados por endereço errado
          podem gerar novo custo de frete.
        </p>
      </section>

      <section>
        <h2>6. Trocas e devoluções</h2>
        <p>
          Seguem a nossa política específica, disponível na página{" "}
          <a href="/politica-de-reembolso">Trocas e devoluções</a>.
        </p>
      </section>

      <section>
        <h2>7. Propriedade intelectual</h2>
        <p>
          O layout, a marca e os textos deste site pertencem à {SITE.nome}. As marcas de
          terceiros citadas pertencem aos seus respectivos titulares e são usadas apenas para
          identificar os produtos.
        </p>
      </section>

      <section>
        <h2>8. Foro</h2>
        <p>
          Estes termos são regidos pela lei brasileira. Fica eleito o foro do domicílio do
          consumidor para resolver eventuais controvérsias.
        </p>
      </section>
    </PaginaTexto>
  );
}
