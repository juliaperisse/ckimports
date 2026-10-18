# CK Importadora

Loja de tênis importados — catálogo, carrinho, checkout com Mercado Pago e
atendimento por WhatsApp.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

Veja `.env.example`. As essenciais:

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site |
| `MERCADO_PAGO_ACCESS_TOKEN` | Criar o pagamento (Checkout Pro) |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Validar o webhook de venda |
| `RESEND_API_KEY` | Enviar o e-mail de aviso de venda |
| `EMAIL_VENDAS` | Para onde vai o aviso de venda |

Sem `MERCADO_PAGO_ACCESS_TOKEN` o site funciona normalmente, mas o checkout
online responde pedindo para o cliente finalizar pelo WhatsApp.

## Estrutura

```
data/produtos.json        catálogo (312 produtos)
public/produtos/<slug>/   fotos de cada produto
scripts/                  extração e normalização do catálogo
src/lib/config.ts         WhatsApp, prazos e dados da loja
src/lib/catalogo.ts       leitura e agrupamento do catálogo
src/lib/pedido.ts         validação do carrinho no servidor
src/lib/mercadopago.ts    API do Mercado Pago
src/app/api/checkout      cria o pagamento
src/app/api/webhooks      recebe a confirmação e dispara o e-mail
```

## Atualizando o catálogo

```bash
python3 scripts/scrape.py             # relê os produtos na origem
python3 scripts/mapear-categorias.py  # marca/coleção de cada produto
python3 scripts/normalizar.py         # consolida o catálogo final
python3 scripts/baixar-imagens.py     # baixa as fotos novas
```

Os preços ficam em `data/produtos.json`, no campo `price`.

## Segurança do checkout

- Os preços **nunca** vêm do navegador: o servidor relê cada item do catálogo
  antes de criar o pagamento (`src/lib/pedido.ts`).
- Nenhum dado de cartão passa pelo site — o cliente paga dentro do ambiente do
  Mercado Pago.
- O webhook confere a assinatura HMAC do Mercado Pago e reconsulta o pagamento
  na API antes de considerar a venda aprovada.
