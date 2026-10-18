export default function PaginaTexto({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] text-ouro uppercase">{subtitulo}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-creme">{titulo}</h1>
        <div className="filete-ouro w-24 mx-auto mt-5" />
      </header>
      <div className="space-y-8 text-[15px] leading-relaxed text-cinza [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-creme [&_h2]:mb-3 [&_strong]:text-creme [&_a]:text-ouro [&_a]:underline [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5">
        {children}
      </div>
    </div>
  );
}
