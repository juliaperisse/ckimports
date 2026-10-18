#!/usr/bin/env python3
"""Extrai catalogo (nome, preco, tamanhos, categoria, imagens) de aguiaimports.com."""
import json, re, html, os, sys, ssl, time, urllib.request, concurrent.futures as cf

OUT = os.path.join(os.path.dirname(__file__), "..", "data")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"

try:
    import certifi
    CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    CTX = ssl._create_unverified_context()


def get(url, binary=False, tries=5):
    last = None
    for n in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                data = r.read()
            return data if binary else data.decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 404:
                raise
            time.sleep(2 ** n)
        except Exception as e:
            last = e
            time.sleep(2 ** n)
    raise last

def unesc_js(s):
    return re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s).replace("\\'", "'")

def big(u):
    u = "https:" + u if u.startswith("//") else u
    return re.sub(r"-\d+-\d+\.webp$", "-1024-1024.webp", u)

def parse(slug, h):
    m = re.search(r"LS\.product = \{(.*?)\n    \};", h, re.S)
    if not m:
        return None
    blk = m.group(1)
    name = re.search(r"name : '(.*?)',\n", blk, re.S)
    name = html.unescape(unesc_js(name.group(1))) if name else slug

    v = re.search(r"LS\.variants = (\[.*?\]);", h, re.S)
    variants, price, compare = [], None, None
    if v:
        try:
            for x in json.loads(v.group(1)):
                variants.append({"size": x.get("option0"), "available": bool(x.get("available"))})
                if price is None:
                    price = x.get("price_number")
                    compare = x.get("compare_at_price_number")
                    if x.get("has_promotional_price") and x.get("promotional_price_number"):
                        price = x["promotional_price_number"]
        except Exception:
            pass

    # galeria principal: slides com data-image-position
    imgs, seen = [], set()
    slides = list(re.finditer(r'data-image="(\d+)" data-image-position="(\d+)"', h))
    for i, s in enumerate(slides):
        iid = s.group(1)
        if iid in seen:
            continue
        body = h[s.end(): slides[i + 1].start() if i + 1 < len(slides) else s.end() + 2500]
        # imagem real vem em src=, data-zoom= ou no maior candidato do srcset
        src = (re.search(r'data-zoom="(//acdn[^"]+/products/[^"]+)"', body)
               or re.search(r'(?<!data-)src="(//acdn[^"]+/products/[^"]+)"', body)
               or re.search(r'(//acdn[^"\s]+/products/[^"\s]+\.webp)', body))
        if src:
            seen.add(iid)
            imgs.append(big(src.group(1)))
    if not imgs:
        og = re.search(r'og:image:secure_url" content="([^"]+)"', h)
        if og:
            imgs = [big(og.group(1))]

    # categoria via breadcrumb (penultimo item)
    cats = re.findall(r'"@type": "ListItem",\s*"position": \d+,\s*"name": "([^"]+)",\s*"item": "([^"]+)"', h)
    cats = [(html.unescape(n), u) for n, u in cats if "/produtos/" not in u and n != "Início"]
    cat = cats[-1][0] if cats else "Outros"

    desc = ""
    d = re.search(r'<div class="user-content[^"]*">(.*?)</div>', h, re.S)
    if d:
        desc = re.sub(r"<[^>]+>", " ", d.group(1))
        desc = html.unescape(re.sub(r"\s+", " ", desc)).strip()

    return {
        "slug": slug, "name": name, "price": price, "compare_at": compare,
        "category": cat, "categoryPath": [c[0] for c in cats],
        "sizes": variants, "images": imgs, "description": desc,
        "freeShipping": 'data-combines="false"' in h and "Frete grátis" in h,
    }

def one(url):
    slug = url.rstrip("/").rsplit("/", 1)[-1]
    try:
        return parse(slug, get(url))
    except Exception as e:
        print("ERRO", slug, e, file=sys.stderr)
        return None

def main():
    sm = get("https://aguiaimports.com/sitemap.xml")
    urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", sm) if "/produtos/" in u and not u.endswith("/produtos/")]
    print(f"{len(urls)} produtos", file=sys.stderr)
    out = []
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        for i, p in enumerate(ex.map(one, urls), 1):
            if p:
                out.append(p)
            if i % 25 == 0:
                print(f"  {i}/{len(urls)}", file=sys.stderr)
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "produtos.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"OK {len(out)} produtos -> data/produtos.json", file=sys.stderr)

if __name__ == "__main__":
    main()
