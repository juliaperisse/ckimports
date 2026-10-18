#!/usr/bin/env python3
"""Mapeia cada produto para suas marcas/categorias reais lendo as paginas de colecao."""
import json, re, os, ssl, sys, time, urllib.request, urllib.error

ROOT = os.path.join(os.path.dirname(__file__), "..")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
try:
    import certifi; CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    CTX = ssl._create_unverified_context()

# slug da colecao no site de origem -> (marca, nome amigavel)
COLECOES = {
    "nike": ("Nike", "Nike"), "new-balance": ("New Balance", "New Balance"),
    "mizuno": ("Mizuno", "Mizuno"), "gucci1": ("Gucci", "Gucci"),
    "chuteiras": ("Chuteiras", "Chuteiras"), "esportivos": ("Esportivos", "Esportivos"),
    "nike/air-max-90": ("Nike", "Air Max 90"), "nike/air-max-95": ("Nike", "Air Max 95"),
    "nike/air-max-97": ("Nike", "Air Max 97"), "nike/air-max-dn": ("Nike", "Air Max Dn"),
    "nike/air-max-dn8": ("Nike", "Air Max Dn8"), "nike/air-max-drift": ("Nike", "Air Max Drift"),
    "nike/air-max-scorpion": ("Nike", "Air Max Scorpion"), "nike/air-max-tn": ("Nike", "Air Max TN"),
    "nike/bailleli": ("Nike", "Bailleli"), "nike/nocta": ("Nike", "NOCTA"),
    "new-balance/1000": ("New Balance", "1000"), "new-balance/2000": ("New Balance", "2000"),
    "new-balance/530": ("New Balance", "530"), "new-balance/9060": ("New Balance", "9060"),
    "mizuno/prophecy-13": ("Mizuno", "Prophecy 13"), "mizuno/prophecy-141": ("Mizuno", "Prophecy 14"),
    "mizuno/prophecy-15": ("Mizuno", "Prophecy 15"), "mizuno/sorayama": ("Mizuno", "Sorayama"),
    "esportivos/adidas-hyperboost-ga0d8": ("Adidas", "Hyperboost"),
    "esportivos/adizero-prime-x3-ga4s7": ("Adidas", "Adizero Prime X3"),
    "esportivos/adizero": ("Adidas", "Adizero"),
    "esportivos/alphafly": ("Nike", "Alphafly"),
    "esportivos/nike-vomero": ("Nike", "Vomero"),
    "esportivos/on-cloud": ("On", "On Cloud"),
}


def get(url):
    for n in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return ""
            time.sleep(2 ** n)
        except Exception:
            time.sleep(2 ** n)
    return ""


def main():
    produtos = json.load(open(os.path.join(ROOT, "data", "produtos.json"), encoding="utf-8"))
    por_slug = {p["slug"]: p for p in produtos}
    for p in produtos:
        p["marcas"], p["colecoes"] = [], []

    for col, (marca, nome) in COLECOES.items():
        achados = set()
        for page in range(1, 12):
            url = f"https://aguiaimports.com/{col}/" + (f"?page={page}" if page > 1 else "")
            h = get(url)
            if not h:
                break
            slugs = set(re.findall(r"aguiaimports\.com/produtos/([a-z0-9\-]+)/", h))
            novos = slugs - achados
            if not novos:
                break
            achados |= slugs
        for s in achados:
            p = por_slug.get(s)
            if not p:
                continue
            if marca not in p["marcas"]:
                p["marcas"].append(marca)
            if nome not in p["colecoes"]:
                p["colecoes"].append(nome)
        print(f"{col:42} {len(achados):4} produtos", file=sys.stderr)

    sem = [p["slug"] for p in produtos if not p["marcas"]]
    print(f"\nsem marca: {len(sem)}", file=sys.stderr)
    for s in sem[:40]:
        print("   ", s, file=sys.stderr)
    json.dump(produtos, open(os.path.join(ROOT, "data", "produtos.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
