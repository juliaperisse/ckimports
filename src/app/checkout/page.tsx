"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCarrinho } from "@/components/carrinho-contexto";
import { reais, linkWhatsApp } from "@/lib/config";

type Campos = Record<string, string>;

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

export default function PaginaCheckout() {
  const { itens, total, pronto } = useCarrinho();
  const [form, setForm] = useState<Campos>({ uf: "SP" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const definir = (campo: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function buscarCep(cep: string) {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm((f) => ({
          ...f,
          rua: d.logradouro || f.rua || "",
          bairro: d.bairro || f.bairro || "",
          cidade: d.localidade || f.cidade || "",
          uf: d.uf || f.uf || "SP",
        }));
      }
    } catch {
      /* preenchimento manual continua disponível */
    } finally {
      setBuscandoCep(false);
    }
  }

  async function finalizar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador: form,
          itens: itens.map((i) => ({
            slug: i.slug,
            tamanho: i.tamanho,
            quantidade: i.quantidade,
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro ?? "Não foi possível continuar.");
      window.location.href = d.url;
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
      setEnviando(false);
    }
  }

  if (!pronto) {
    return <div className="mx-auto max-w-5xl px-4 py-32 text-center text-cinza">Carregando…</div>;
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-28 text-center">
        <h1 className="font-display text-4xl text-creme">Carrinho vazio</h1>
        <p className="mt-4 text-cinza">Escolha seus tênis antes de finalizar.</p>
        <Link
          href="/produtos"
          className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase"
        >
          Ver tênis
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center">
        <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">Finalizar compra</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-creme">Seus dados</h1>
        <div className="filete-ouro w-24 mx-auto mt-5" />
        <p className="mt-5 text-sm text-cinza max-w-md mx-auto">
          Preencha para gerar o pagamento. Você será levado para o ambiente seguro do
          Mercado Pago para pagar com Pix, cartão ou boleto.
        </p>
      </header>

      <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={finalizar} className="space-y-8">
          <Secao titulo="Dados pessoais">
            <Campo id="nome" rotulo="Nome completo" valor={form.nome} aoMudar={definir("nome")} autoComplete="name" className="sm:col-span-2" />
            <Campo id="email" rotulo="E-mail" tipo="email" valor={form.email} aoMudar={definir("email")} autoComplete="email" />
            <Campo id="telefone" rotulo="WhatsApp com DDD" valor={form.telefone} aoMudar={definir("telefone")} autoComplete="tel" inputMode="numeric" dica="Ex.: 19971501971" />
            <Campo id="cpf" rotulo="CPF" valor={form.cpf} aoMudar={definir("cpf")} inputMode="numeric" dica="Exigido pelo Mercado Pago" />
          </Secao>

          <Secao titulo="Endereço de entrega">
            <Campo
              id="cep"
              rotulo="CEP"
              valor={form.cep}
              aoMudar={(e) => {
                definir("cep")(e);
                void buscarCep(e.target.value);
              }}
              autoComplete="postal-code"
              inputMode="numeric"
              dica={buscandoCep ? "Buscando endereço…" : "Preenchemos o resto para você"}
            />
            <Campo id="rua" rotulo="Rua" valor={form.rua} aoMudar={definir("rua")} autoComplete="address-line1" />
            <Campo id="numero" rotulo="Número" valor={form.numero} aoMudar={definir("numero")} />
            <Campo id="complemento" rotulo="Complemento (opcional)" valor={form.complemento} aoMudar={definir("complemento")} obrigatorio={false} />
            <Campo id="bairro" rotulo="Bairro" valor={form.bairro} aoMudar={definir("bairro")} />
            <Campo id="cidade" rotulo="Cidade" valor={form.cidade} aoMudar={definir("cidade")} />
            <div>
              <label htmlFor="uf" className="block text-xs tracking-wider text-cinza uppercase mb-2">
                Estado
              </label>
              <select
                id="uf"
                value={form.uf ?? "SP"}
                onChange={definir("uf")}
                className="w-full bg-grafite border border-ouro/15 px-4 py-3.5 text-sm text-creme focus:outline-none focus:border-ouro/60 transition"
              >
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </Secao>

          {erro && (
            <div role="alert" className="border border-ouro/40 bg-ouro/5 px-4 py-3.5 text-sm text-ouro-claro">
              {erro}
              <a
                href={linkWhatsApp("Olá! Tive um problema no checkout do site e quero finalizar meu pedido por aqui.")}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 underline hover:text-creme"
              >
                Finalizar pelo WhatsApp
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 disabled:opacity-50 disabled:cursor-wait transition"
          >
            {enviando ? "Gerando pagamento…" : `Ir para o pagamento · ${reais(total)}`}
          </button>

          <p className="text-center text-xs text-cinza">
            🔒 Seus dados de cartão são digitados direto no Mercado Pago. Nosso site nunca
            vê nem armazena esses dados.
          </p>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start border border-ouro/20 p-6 h-fit">
          <h2 className="font-display text-2xl text-creme">Seu pedido</h2>
          <div className="filete-ouro mt-4" />

          <ul className="mt-5 space-y-4">
            {itens.map((i) => (
              <li key={`${i.slug}-${i.tamanho}`} className="flex gap-3">
                <div className="relative w-14 aspect-3/4 shrink-0 bg-grafite overflow-hidden">
                  {i.imagem && <Image src={i.imagem} alt="" fill sizes="56px" className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <p className="text-creme leading-snug line-clamp-2">{i.nome}</p>
                  <p className="text-xs text-cinza mt-0.5">
                    Tam {i.tamanho} · {i.quantidade}x
                  </p>
                </div>
                <p className="text-sm text-creme whitespace-nowrap">
                  {reais(i.preco * i.quantidade)}
                </p>
              </li>
            ))}
          </ul>

          <div className="filete-ouro my-5" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-cinza">
              <dt>Subtotal</dt>
              <dd className="text-creme">{reais(total)}</dd>
            </div>
            <div className="flex justify-between text-cinza">
              <dt>Frete</dt>
              <dd className="text-ouro">Grátis</dd>
            </div>
          </dl>
          <div className="filete-ouro my-5" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-cinza">Total</span>
            <span className="font-display text-3xl text-creme">{reais(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-[11px] tracking-[0.25em] text-ouro uppercase">{titulo}</legend>
      <div className="filete-ouro mt-3 mb-5" />
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo = "text",
  dica,
  obrigatorio = true,
  className = "",
  ...resto
}: {
  id: string;
  rotulo: string;
  valor?: string;
  aoMudar: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tipo?: string;
  dica?: string;
  obrigatorio?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs tracking-wider text-cinza uppercase mb-2">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor ?? ""}
        onChange={aoMudar}
        required={obrigatorio}
        className="w-full bg-grafite border border-ouro/15 px-4 py-3.5 text-sm text-creme placeholder:text-cinza focus:outline-none focus:border-ouro/60 transition"
        {...resto}
      />
      {dica && <p className="mt-1.5 text-xs text-cinza">{dica}</p>}
    </div>
  );
}
