"""Extract I18N object from legacy index.html into 3 JSON message files."""
import re, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC_HTML = os.path.join(ROOT, "index.html")
OUT_DIR = os.path.join(ROOT, "next-app", "src", "i18n", "messages")

with open(SRC_HTML, "r", encoding="utf-8") as f:
    html = f.read()

m = re.search(r"const I18N = \{(.*?)^\};", html, re.DOTALL | re.MULTILINE)
if not m:
    print("ERROR: I18N block not found", file=sys.stderr)
    sys.exit(1)

body = m.group(1)
locale_pattern = re.compile(r"^\s*(ru|en|ro):\s*\{(.*?)\n\s*\}", re.DOTALL | re.MULTILINE)

KV_RE = re.compile(r"""['"]([\w.]+)['"]\s*:\s*(['"])((?:\\.|(?!\2).)*?)\2""")

DQ = '"'
SQ = "'"
BS = "\\"

def unescape(val, quote):
    if quote == DQ:
        val = val.replace(BS + DQ, DQ)
    else:
        val = val.replace(BS + SQ, SQ)
    val = val.replace(BS + BS, BS)
    return val

results = {}
for lm in locale_pattern.finditer(body):
    lang = lm.group(1)
    content = lm.group(2)
    entries = {}
    for kvm in KV_RE.finditer(content):
        key = kvm.group(1)
        quote = kvm.group(2)
        raw = kvm.group(3)
        entries[key] = unescape(raw, quote)
    results[lang] = entries
    print(f"{lang}: {len(entries)} keys")

os.makedirs(OUT_DIR, exist_ok=True)
for lang, data in results.items():
    out_path = os.path.join(OUT_DIR, f"{lang}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"wrote {out_path}")
