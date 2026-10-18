import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-display text-7xl texto-ouro">404</p>
      <h1 className="mt-4 font-display text-3xl text-creme">Página não encontrada</h1>
      <div className="filete-ouro w-24 mx-auto mt-5" />
      <p className="mt-6 text-cinza">
        O link pode estar errado ou o produto saiu do catálogo.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/produtos"
          className="px-8 py-4 bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-escuro text-preto text-sm font-semibold tracking-[0.15em] uppercase hover:brightness-110 transition"
        >
          Ver o catálogo
        </Link>
        <Link
          href="/"
          className="px-8 py-4 border border-ouro/40 text-ouro text-sm font-semibold tracking-[0.15em] uppercase hover:bg-ouro hover:text-preto transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
