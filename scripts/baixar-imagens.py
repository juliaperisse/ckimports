#!/usr/bin/env python3
"""Baixa todas as imagens do catalogo para public/produtos/<slug>/N.webp e reescreve os caminhos."""
import json, os, ssl, sys, urllib.request, concurrent.futures as cf, time

ROOT = os.path.join(os.path.dirname(__file__), "..")
DEST = os.path.join(ROOT, "public", "produtos")
DATA = os.path.join(ROOT, "data", "produtos.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
try:
    import certifi; CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    CTX = ssl._create_unverified_context()


def baixar(job):
    url, path = job
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return True
    for n in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
                data = r.read()
            if len(data) < 500:
                raise ValueError("arquivo muito pequeno")
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "wb") as f:
                f.write(data)
            return True
        except Exception as e:
            if n == 4:
                print("FALHOU", url, e, file=sys.stderr)
                return False
            time.sleep(2 ** n)


def main():
    produtos = json.load(open(DATA, encoding="utf-8"))
    jobs, mapa = [], {}
    for p in produtos:
        locais = []
        for i, url in enumerate(p["images"]):
            rel = f"/produtos/{p['slug']}/{i}.webp"
            jobs.append((url, os.path.join(DEST, p["slug"], f"{i}.webp")))
            locais.append(rel)
        mapa[p["slug"]] = locais
    print(f"{len(jobs)} imagens", file=sys.stderr)
    ok = 0
    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for i, r in enumerate(ex.map(baixar, jobs), 1):
            ok += bool(r)
            if i % 100 == 0:
                print(f"  {i}/{len(jobs)}", file=sys.stderr)
    for p in produtos:
        p["imagesRemote"] = p["images"]
        p["images"] = [rel for rel in mapa[p["slug"]]
                       if os.path.exists(os.path.join(ROOT, "public", rel.lstrip("/")))]
    json.dump(produtos, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"OK {ok}/{len(jobs)} imagens baixadas", file=sys.stderr)


if __name__ == "__main__":
    main()
