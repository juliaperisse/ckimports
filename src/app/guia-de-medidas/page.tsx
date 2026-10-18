import type { Metadata } from "next";
import PaginaTexto from "@/components/pagina-texto";
import { SITE, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Guia de medidas",
  description:
    "Tabela de numeração BR, US e EUR e como medir o pé para acertar o tamanho do tênis.",
};

/** Comprimento do pé em cm por numeração BR — referência para tênis importados. */
const TABELA = [
  { br: "37", eur: "38", us: "6", cm: "23,5" },
  { br: "38", eur: "39", us: "6,5", cm: "24,0" },
  { br: "39", eur: "40", us: "7,5", cm: "25,0" },
  { br: "40", eur: "41", us: "8", cm: "25,5" },
  { br: "41", eur: "42", us: "9", cm: "26,5" },
  { br: "42", eur: "43", us: "9,5", cm: "27,0" },
  { br: "43", eur: "44", us: "10,5", cm: "28,0" },
  { br: "44", eur: "45", us: "11", cm: "28,5" },
];

export default function Pagina() {
  return (
    <PaginaTexto titulo="Guia de medidas" subtitulo="Numeração">
      <section>
        <h2>Como medir seu pé</h2>
        <ol>
          <li>Apoie uma folha de papel no chão, encostada na parede.</li>
          <li>Fique de pé sobre a folha, com o calcanhar na parede.</li>
          <li>Marque com um lápis onde termina o dedo maior.</li>
          <li>Meça com uma régua a distância da borda até a marca, em centímetros.</li>
          <li>Meça os dois pés no fim do dia e use sempre a maior medida.</li>
        </ol>
      </section>

      <section>
        <h2>Tabela de numeração</h2>
        <div className="overflow-x-auto border border-ouro/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-grafite text-ouro text-left">
                <th className="px-4 py-3 font-medium tracking-wider">BR</th>
                <th className="px-4 py-3 font-medium tracking-wider">EUR</th>
                <th className="px-4 py-3 font-medium tracking-wider">US</th>
                <th className="px-4 py-3 font-medium tracking-wider">Pé (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ouro/10">
              {TABELA.map((l) => (
                <tr key={l.br}>
                  <td className="px-4 py-3 text-creme">{l.br}</td>
                  <td className="px-4 py-3">{l.eur}</td>
                  <td className="px-4 py-3">{l.us}</td>
                  <td className="px-4 py-3">{l.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          A numeração no site segue o padrão <strong>brasileiro</strong>.
        </p>
      </section>

      <section>
        <h2>Dicas importantes</h2>
        <ul>
          <li>
            Tênis de corrida (Vomero, Alphafly, Adizero, On Cloud) costumam calçar{" "}
            <strong>justos</strong>. Se você está entre dois números, pegue o maior.
          </li>
          <li>
            Chuteiras calçam <strong>mais apertadas</strong> por padrão — é assim mesmo,
            mas quem tem pé largo deve considerar um número acima.
          </li>
          <li>Air Max e modelos de lifestyle costumam calçar no número normal.</li>
        </ul>
      </section>

      <section className="border border-ouro/25 p-6 text-center">
        <h2>Ainda em dúvida?</h2>
        <p className="mt-2">
          Manda a medida do seu pé em centímetros no WhatsApp que a gente te diz exatamente
          qual número pedir naquele modelo.
        </p>
        <a
          href={linkWhatsApp("Olá! Preciso de ajuda para escolher a numeração. Meu pé mede ___ cm.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-8 py-3.5 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase !no-underline"
        >
          {SITE.whatsapp.exibicao}
        </a>
      </section>
    </PaginaTexto>
  );
}
