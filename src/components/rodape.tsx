import Image from "next/image";
import Link from "next/link";
import { MARCAS } from "@/lib/catalogo";
import { SITE } from "@/lib/config";

const INSTITUCIONAL = [
  { href: "/como-comprar", rotulo: "Como comprar" },
  { href: "/prazos-e-entregas", rotulo: "Prazos e entregas" },
  { href: "/guia-de-medidas", rotulo: "Guia de medidas" },
  { href: "/perguntas-frequentes", rotulo: "Perguntas frequentes" },
  { href: "/rastrear", rotulo: "Rastrear pedido" },
];

const LEGAL = [
  { href: "/politica-de-privacidade", rotulo: "Política de privacidade" },
  { href: "/politica-de-reembolso", rotulo: "Trocas e devoluções" },
  { href: "/termos-de-uso", rotulo: "Termos de uso" },
];

// Avaliado uma vez no build: o ano do rodapé não precisa ser recalculado por request.
const ANO = new Date().getFullYear();

export default function Rodape() {
  return (
    <footer className="mt-24 border-t border-ouro/15 bg-carvao">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo-ck.jpg"
              alt={SITE.nome}
              width={84}
              height={84}
              className="rounded-full ring-1 ring-ouro/30"
            />
            <p className="mt-5 text-sm leading-relaxed text-cinza max-w-xs">
              Tênis importados de alta qualidade, selecionados peça a peça. Enviamos
              para todo o Brasil.
            </p>
            <a
              href={`https://wa.me/${SITE.whatsapp.numero}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-ouro hover:text-ouro-claro transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.43-4.4-1.2l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              {SITE.whatsapp.exibicao}
            </a>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ouro uppercase">Marcas</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {MARCAS.map((m) => (
                <li key={m.slug}>
                  <Link href={`/marca/${m.slug}`} className="text-cinza hover:text-creme transition">
                    {m.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ouro uppercase">Ajuda</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {INSTITUCIONAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cinza hover:text-creme transition">
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ouro uppercase">Institucional</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cinza hover:text-creme transition">
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-display text-sm tracking-[0.25em] text-ouro uppercase">
              Pagamento
            </h3>
            <p className="mt-4 text-sm text-cinza leading-relaxed">
              Pix, cartão em até 12x e boleto.
              <br />
              Pagamento processado pelo Mercado Pago.
            </p>
          </div>
        </div>

        <div className="filete-ouro mt-12" />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cinza">
          <p>
            © {ANO} {SITE.nome}. Todos os direitos reservados.
          </p>
          <p>Compra 100% segura · Site protegido por SSL</p>
        </div>
      </div>
    </footer>
  );
}
