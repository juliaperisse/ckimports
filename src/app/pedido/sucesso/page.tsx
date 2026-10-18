import type { Metadata } from "next";
import { Suspense } from "react";
import RetornoPedido from "@/components/retorno-pedido";

export const metadata: Metadata = { robots: { index: false } };

async function Conteudo({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <RetornoPedido variante="sucesso" referencia={ref} />;
}

export default function Pagina(props: {
  searchParams: Promise<{ ref?: string }>;
}) {
  return (
    <Suspense fallback={<RetornoPedido variante="sucesso" />}>
      <Conteudo searchParams={props.searchParams} />
    </Suspense>
  );
}
