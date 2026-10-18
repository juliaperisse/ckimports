import Image from "next/image";
import Link from "next/link";
import CartaoProduto from "@/components/cartao-produto";
import { MARCAS, PRODUTOS, emDestaque } from "@/lib/catalogo";
import { SITE, linkWhatsApp } from "@/lib/config";

const VANTAGENS = [
  {
    titulo: "Qualidade importada",
    texto: "Peças selecionadas uma a uma, com acabamento e materiais de primeira linha.",
  },
  {
    titulo: "Frete grátis",
    texto: `Enviamos para todo o Brasil sem custo adicional. Prazo de ${SITE.frete.prazo}.`,
  },
  {
    titulo: "Pagamento seguro",
    texto: "Pix, boleto ou cartão em até 12x, processado pelo Mercado Pago.",
  },
  {
    titulo: "Atendimento real",
    texto: "Dúvida sobre numeração ou modelo? Chama no WhatsApp e a gente te ajuda.",
  },
];

export default function Home() {
  const destaques = emDestaque(8);
  const lancamentos = PRODUTOS.filter((p) => p.images.length > 1).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ouro/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(212,162,76,0.16),transparent_62%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 text-center surgir">
          <Image
            src="/logo-ck.jpg"
            alt=""
            width={132}
            height={132}
            priority
            className="mx-auto rounded-full ring-1 ring-ouro/40"
          />
          <h1 className="mt-9 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            <span className="texto-ouro">Tênis importados</span>
            <span className="block text-creme mt-1">de verdade.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-cinza">
            Nike, Adidas, New Balance, Mizuno, On e chuteiras. {PRODUTOS.length} modelos
            prontos para envio, com frete grátis para todo o Brasil.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/produtos"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
            >
              Ver coleção
            </Link>
            <a
              href={linkWhatsApp("Olá! Quero saber mais sobre os tênis da CK Importadora.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4 border border-ouro/40 text-ouro text-sm font-semibold tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <Cabecalhada titulo="Escolha pela marca" subtitulo="Nossas categorias" />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {MARCAS.map((m) => (
            <Link
              key={m.slug}
              href={`/marca/${m.slug}`}
              className="group relative aspect-4/5 sm:aspect-square overflow-hidden bg-grafite"
            >
              {m.capa && (
                <Image
                  src={m.capa}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover opacity-55 transition duration-700 group-hover:opacity-80 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-preto via-preto/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-2xl text-creme group-hover:text-ouro transition">
                  {m.nome}
                </h3>
                <p className="text-xs text-cinza mt-0.5">{m.total} modelos</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas */}
      <section className="border-y border-ouro/15 bg-carvao">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <Cabecalhada titulo="Maiores descontos" subtitulo="Promoções" />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {destaques.map((p, i) => (
              <CartaoProduto key={p.slug} produto={p} prioridade={i < 4} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/produtos"
              className="inline-block px-10 py-4 border border-ouro/40 text-ouro text-sm tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
            >
              Ver todos os {PRODUTOS.length} modelos
            </Link>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VANTAGENS.map((v) => (
            <div key={v.titulo}>
              <div className="filete-ouro w-12" />
              <h3 className="mt-4 font-display text-xl text-creme">{v.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mais modelos */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <Cabecalhada titulo="Acabou de chegar" subtitulo="Novidades" />
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {lancamentos.map((p) => (
            <CartaoProduto key={p.slug} produto={p} />
          ))}
        </div>
      </section>

      {/* Chamada WhatsApp */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden border border-ouro/25 px-6 py-14 sm:py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(212,162,76,0.14),transparent_60%)]" />
          <div className="relative">
            <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">Atendimento</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl text-creme">
              Prefere comprar pelo WhatsApp?
            </h2>
            <p className="mt-4 mx-auto max-w-lg text-cinza leading-relaxed">
              Manda o modelo e a numeração que a gente confirma disponibilidade, calcula o
              frete e fecha o pedido por lá mesmo.
            </p>
            <a
              href={linkWhatsApp("Olá! Quero fazer um pedido pelo WhatsApp.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
            >
              {SITE.whatsapp.exibicao}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Cabecalhada({ titulo, subtitulo }: { titulo: string; subtitulo: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">{subtitulo}</p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl text-creme">{titulo}</h2>
      <div className="filete-ouro w-24 mx-auto mt-5" />
    </div>
  );
}
