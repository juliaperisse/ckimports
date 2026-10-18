import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a CK Importadora no WhatsApp ${SITE.whatsapp.exibicao}.`,
};

export default function Pagina() {
  return (
    <PaginaTexto titulo="Fale com a gente" subtitulo="Contato">
      <section className="border border-ouro/25 p-8 text-center">
        <h2>WhatsApp</h2>
        <p className="mt-2">
          O jeito mais rápido de falar com a gente. Tira dúvida de numeração, confirma
          disponibilidade e fecha o pedido por lá mesmo.
        </p>
        <a
          href={linkWhatsApp("Olá! Vim pelo site da CK Importadora.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2.5 px-9 py-4 bg-[#25D366] text-preto text-sm font-semibold tracking-[0.1em] uppercase !no-underline hover:brightness-110 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
          </svg>
          {SITE.whatsapp.exibicao}
        </a>
      </section>

      <section>
        <h2>Horário de atendimento</h2>
        <p>Segunda a sábado, das 9h às 19h. Fora desse horário respondemos assim que der.</p>
      </section>

      <section>
        <h2>Onde estamos</h2>
        <p>
          Nosso estoque fica em <strong>São Paulo — SP</strong>. Todas as vendas são feitas
          online, com envio pelos Correios para todo o Brasil.
        </p>
      </section>

      <section>
        <h2>Redes sociais</h2>
        <p>
          Acompanhe as novidades e os lançamentos no nosso{" "}
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          .
        </p>
      </section>
    </PaginaTexto>
  );
}
