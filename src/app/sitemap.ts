import type { MetadataRoute } from "next";
import { MARCAS, PRODUTOS } from "@/lib/catalogo";
import { SITE } from "@/lib/config";

const ESTATICAS = [
  "", "/produtos", "/como-comprar", "/prazos-e-entregas", "/guia-de-medidas",
  "/perguntas-frequentes", "/contato", "/rastrear", "/politica-de-privacidade",
  "/politica-de-reembolso", "/termos-de-uso",
];

const GERADO_EM = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = GERADO_EM;
  return [
    ...ESTATICAS.map((rota) => ({
      url: `${SITE.url}${rota}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: rota === "" ? 1 : 0.6,
    })),
    ...MARCAS.map((m) => ({
      url: `${SITE.url}/marca/${m.slug}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PRODUTOS.map((p) => ({
      url: `${SITE.url}/produto/${p.slug}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
