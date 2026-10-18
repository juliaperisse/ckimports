#!/usr/bin/env python3
"""Preenche marca/colecao dos produtos que nenhuma colecao do site de origem cobriu,
inferindo pelo slug e pelo nome, e grava o catalogo final em data/produtos.json."""
import json, os, re, sys, unicodedata

ROOT = os.path.join(os.path.dirname(__file__), "..")

# (regex no slug+nome, marca, colecao)
REGRAS = [
    (r"\bjordan\b", "Nike", "Jordan 1"),
    (r"court-vision|court vision", "Nike", "Court Vision"),
    (r"court-borough|court borough", "Nike", "Court Borough"),
    (r"\bshox\b", "Nike", "Shox TL"),
    (r"bailelli|bailleli", "Nike", "Bailleli"),
    (r"\bphantom\b|chuteira", "Chuteiras", "Chuteiras"),
    (r"on-running|on running|\bon cloud\b|cloudmonster|cloudsurfer", "On", "On Cloud"),
    (r"\bmizuno\b|prophecy|wave ", "Mizuno", "Mizuno"),
    (r"air-max|air max", "Nike", "Air Max"),
    (r"vomero", "Nike", "Vomero"),
    (r"alphafly|pegasus|vaporfly", "Nike", "Corrida"),
    (r"adizero|hyperboost|\badidas\b|\bf50\b", "Adidas", "Adidas"),
    (r"new-balance|new balance|\b9060\b|\b530\b", "New Balance", "New Balance"),
    (r"\bgucci\b", "Gucci", "Gucci"),
    (r"\bnike\b", "Nike", "Nike"),
]


def sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()


def main():
    caminho = os.path.join(ROOT, "data", "produtos.json")
    produtos = json.load(open(caminho, encoding="utf-8"))

    for p in produtos:
        alvo = sem_acento(f"{p['slug']} {p['name']}")
        if not p.get("marcas"):
            for rx, marca, col in REGRAS:
                if re.search(rx, alvo):
                    p["marcas"] = [marca]
                    p["colecoes"] = [col]
                    break
        if not p.get("marcas"):
            p["marcas"], p["colecoes"] = ["Outros"], ["Outros"]

        # "Esportivos" sozinho e generico demais para virar marca
        if p["marcas"] == ["Esportivos"]:
            for rx, marca, col in REGRAS:
                if re.search(rx, alvo):
                    p["marcas"] = [marca]
                    break
        p["marcas"] = [m for m in p["marcas"] if m != "Esportivos"] or p["marcas"]
        p["marca"] = p["marcas"][0]
        p["colecao"] = (p.get("colecoes") or [p["marca"]])[0]
        p["tamanhos"] = [v["size"] for v in p["sizes"] if v.get("size")]
        p.pop("categoryPath", None); p.pop("category", None); p.pop("imagesRemote", None)

    json.dump(produtos, open(caminho, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    import collections
    print("sem marca:", sum(1 for p in produtos if p["marca"] == "Outros"), file=sys.stderr)
    for m, n in collections.Counter(p["marca"] for p in produtos).most_common():
        print(f"{n:4} {m}", file=sys.stderr)


if __name__ == "__main__":
    main()
