#!/usr/bin/env python3
"""Render §18 of docs/PRD-aadm-delivery-maps.md as the J1 delivery map (PNG) plus a structure JSON.

Usage: python3 docs/scripts/render_delivery_map.py docs/PRD-aadm-delivery-maps.md docs/aadm-delivery-maps-map.png

J1 visual language (PRD F2-e1): stage columns named by result; one card per batch and per slice, titled by
result with the ID as a small tag; green (done), amber (You are here), gray (not started); BRIAN and ASK chips;
the stories a slice delivers; a column-check card at the foot of each stage; a legend at the top.
Card titles are derived from the slice text (a bold title where the slice has one, else its first sentence),
so they are not Blueprint's hand-written titles. The JSON sidecar (same path with .json) holds the structure
F2-e2 compares: stages, batches, cards, statuses and the You are here marker. Needs Pillow and a TrueType font.
"""
import json, re, sys, textwrap
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
FONT_DIR = "/System/Library/Fonts/Supplemental/"
def font(size, bold=False):
    for name in (["Arial Bold.ttf", "Verdana Bold.ttf"] if bold else ["Arial.ttf", "Verdana.ttf"]):
        try: return ImageFont.truetype(FONT_DIR + name, size)
        except OSError: pass
    return ImageFont.load_default()

# ------------------------------------------------------------------ parse §18
text = open(SRC, encoding="utf-8").read()
lines = text.split("\n")
s = next(i for i, l in enumerate(lines) if l.startswith("## 18. "))
e = next(i for i, l in enumerate(lines) if l.startswith("## 19. "))
ID = r"(?:DM[0-9]|DMT|DMF|F[0-9])-[a-z][0-9]"
stage_re = re.compile(r"^\*\*Stage ([^:]+): (.+?)\*\* \((.*)\)\s*$")
batch_re = re.compile(r"^- Batch `([A-Za-z0-9]+-[a-z])` \*\*(.+?)\*\*")
slice_re = re.compile(r"^  - `(" + ID + r")` (.*)$")
col_re = re.compile(r"^- `(C[A-Z0-9]+)` column check \((.*)\)")
title_line = next(l for l in lines[:40] if l.startswith("Status:"))
version = re.search(r"\*\*(v[0-9.]+)\*\*", title_line).group(1)

stages = []
cur = None
for l in lines[s:e]:
    if l.startswith("**Where the"): break
    m = stage_re.match(l)
    if m:
        cur = {"id": m.group(1).strip(), "result": m.group(2).strip(), "who": m.group(3).strip(), "batches": [], "check": None}
        stages.append(cur); continue
    if not cur: continue
    m = batch_re.match(l)
    if m:
        cur["batches"].append({"id": m.group(1), "title": m.group(2).strip(), "slices": []}); continue
    m = slice_re.match(l)
    if m and cur["batches"]:
        cur["batches"][-1]["slices"].append({"id": m.group(1), "body": m.group(2)}); continue
    if l.startswith("    ") and cur["batches"] and cur["batches"][-1]["slices"]:
        cur["batches"][-1]["slices"][-1]["body"] += " " + l.strip(); continue
    m = col_re.match(l)
    if m:
        cur["check"] = {"id": m.group(1), "text": m.group(2)}

def clean(t):
    t = re.sub(r"`", "", t)
    t = re.sub(r"\*\*|\*", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def derive(sl):
    b = sl["body"]
    status = "done" if b.startswith("✅") else ("here" if "You are here" in b[:60] else "todo")
    chips = []
    if re.search(r"Owner BRIAN|Brian's own step", b): chips.append("BRIAN")
    if "**ASK" in b or "ASK," in b or "ASK:" in b or "ASK Blueprint" in b: chips.append("ASK")
    m = re.search(r"stories ([^)]*)\)", b)
    stories = ("Stories " + clean(m.group(1))) if m else ""
    # title: the bold title after the leading parentheticals, else the first sentence
    head = b
    head = re.sub(r"^✅ \*\*DONE \(.*?\)\.\*\*\s*", "", head)
    head = re.sub(r"^← \*\*You are here\.\*\*\s*", "", head)
    while True:
        m2 = re.match(r"^\*\*\((?:[^()]|\([^()]*\))*\)\*\*\s*", head)
        if not m2: break
        head = head[m2.end():]
    m3 = re.match(r"^\*\*(.+?)\*\*", head)
    if m3 and len(m3.group(1)) < 90:
        title = clean(m3.group(1)).rstrip(".")
    else:
        t = clean(head)
        t = re.split(r"(?<=[a-z0-9)])\. |: \*|\. \*|; ", t)[0]
        title = t[:92].rstrip(" ,.;:") + ("…" if len(t) > 92 else "")
    if status == "done":
        m4 = re.search(r"DONE \((.*?)\)\.\*\*", b)
        done = "Done: " + clean(m4.group(1))[:110] if m4 else "Done"
    else:
        m4 = re.search(r"\*Done(?: \([^)]*\))?:\*\s*(.*?)(?=; |\. \*|$)", b)
        done = ("Done when: " + clean(m4.group(1))[:120].rstrip(" (,;:")) if m4 else ""
    return {"id": sl["id"], "status": status, "title": title, "done": done, "chips": chips, "stories": stories}

for st in stages:
    for b in st["batches"]:
        b["cards"] = [derive(x) for x in b["slices"]]
        for x in b["slices"]: del x["body"]

# ------------------------------------------------------------------ layout
W = 3000; MARGIN = 40; COLS = 6; GAP = 20
COLW = (W - 2 * MARGIN - (COLS - 1) * GAP) // COLS
PAD = 16; TEXTW = COLW - 2 * PAD - 12
F_TITLE, F_SUB, F_LEG = font(44, True), font(22), font(22)
F_STAGE_S, F_STAGE, F_WHO = font(20, True), font(22, True), font(17)
F_CARD, F_BODY, F_CHIP, F_ROW = font(20, True), font(17), font(16), font(26, True)
NAVY, GRAYBG, BATCHBG, DONEBG, HEREBG = "#1f2937", "#eef1f5", "#e3e8f1", "#e4f3e8", "#fff3d1"
GREEN, AMBER, GRAY, RED, BORDER, TXT, MUTED = "#2f855a", "#d69e2e", "#9aa3ad", "#c53030", "#c9d0d8", "#111827", "#4b5563"
draw0 = ImageDraw.Draw(Image.new("RGB", (10, 10)))

def wrap(t, f, width):
    out, line = [], ""
    for w in t.split(" "):
        cand = (line + " " + w).strip()
        if draw0.textlength(cand, font=f) <= width: line = cand
        else:
            if line: out.append(line)
            line = w
    if line: out.append(line)
    return out

def card_h(c):
    h = PAD + 26 + 6
    h += len(wrap(c["title"], F_CARD, TEXTW)) * 25 + 4
    if c["done"]: h += len(wrap(c["done"], F_BODY, TEXTW)) * 21 + 4
    if c["chips"] or c["stories"]: h += 30
    return h + PAD

def batch_h(b):
    return PAD + len(wrap(b["title"], F_CARD, TEXTW)) * 25 + 30 + PAD

STAGE_H, CHECK_H, MAXCOL = 160, 70, 2900

# split each stage into columns of at most MAXCOL px
columns = []   # (stage, part_index, n_parts, items) items = ("batch", b) | ("card", c) | ("check", chk)
for st in stages:
    items = []
    for b in st["batches"]:
        items.append(("batch", b, batch_h(b)))
        for c in b["cards"]: items.append(("card", c, card_h(c)))
    if st["check"]: items.append(("check", st["check"], CHECK_H))
    parts, cur_items, h = [], [], 0
    for it in items:
        if h + it[2] + 12 > MAXCOL and cur_items:
            parts.append(cur_items); cur_items, h = [], 0
        cur_items.append(it); h += it[2] + 12
    if cur_items: parts.append(cur_items)
    if len(parts) > 1 and all(it[0] == "check" for it in parts[-1]):   # never a column holding only the column check
        parts[-2].extend(parts.pop())
    for i, p in enumerate(parts): columns.append((st, i, len(parts), p))

ROW_TITLES = {"0": "Row 1 · FIELD CORE · the loop first (Stages 0, V, F3, F4)", "H": "Row 2 · FIELD CORE · hardening, the web shell's views, safe to depend on (H, F5, F6)",
              "F8": "Row 3 · LATER STAGES · full web editing, billing, settings, Terrain (F8, F7, T)", "6A": "Row 4 · LATER STAGES · FDE customer context, readiness, the firm layer, customer data planes (6A, 6B, 6C, 8)"}
rows, row = [], []
for col in columns:
    st = col[0]
    if col[1] == 0 and st["id"] in ROW_TITLES and row:
        rows.append(row); row = []
    if len(row) == COLS: rows.append(row); row = []
    row.append(col)
if row: rows.append(row)

def col_height(col): return STAGE_H + sum(it[2] + 12 for it in col[3])
HEADER_H = 330
total_h = HEADER_H + sum(60 + max(col_height(c) for c in r) + 40 for r in rows) + 60
img = Image.new("RGB", (W, total_h), "white"); d = ImageDraw.Draw(img)

def rrect(box, fill, outline=None, r=10, width=2): d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)
def chip(x, y, label, fill, color, f=F_CHIP, outline=None):
    w = d.textlength(label, font=f) + 16
    rrect((x, y, x + w, y + 26), fill, outline=outline, r=6, width=2)
    d.text((x + 8, y + 4), label, font=f, fill=color); return w

# header
d.text((MARGIN, 36), f"AADM Field  ·  from a fuzzy idea to a finished outcome: the {version} build plan", font=F_TITLE, fill=TXT)
sub = ("Field turns an idea into a vision, signed requirements and the one maintained roadmap, then runs it: one prompt per slice, Go, a judged report, the next prompt. "
       f"{version} (D53) puts the loop first: Stage V runs it end to end on Blueprint's own roadmap, then requirements and Slack, then the hardening the demo did not need (Stage H), then the web shell's views. "
       "Full web editing, billing and the FDE extras are later stages, kept as plumbing, never the Field UX purpose (D45). Rules: dev, one commit per slice, no push. "
       "Card titles are derived from the slice text by docs/scripts/render_delivery_map.py.")
y = 100
for l in wrap(sub, F_SUB, W - 2 * MARGIN): d.text((MARGIN, y), l, font=F_SUB, fill=MUTED); y += 30
y += 12; x = MARGIN
for label, fill, outline in (("Done", DONEBG, GREEN), ("You are here (in progress)", HEREBG, AMBER), ("Not started", GRAYBG, GRAY)):
    rrect((x, y, x + 34, y + 34), fill, outline=outline, r=6, width=3); d.text((x + 46, y + 4), label, font=F_LEG, fill=TXT)
    x += d.textlength(label, font=F_LEG) + 90
x += chip(x, y + 4, "You are here", RED, "white", F_LEG) + 30
rrect((x, y, x + 34, y + 34), "white", outline=GREEN, r=6, width=3); d.text((x + 46, y + 4), "= column check at the foot of each stage", font=F_LEG, fill=TXT)
y += 50; x = MARGIN
x += chip(x, y, "BRIAN", "white", "#b45309", F_LEG, outline="#b45309") + 12; d.text((x, y + 4), "= Brian's own step", font=F_LEG, fill=TXT); x += 230
x += chip(x, y, "ASK", "white", "#b45309", F_LEG, outline="#b45309") + 12; d.text((x, y + 4), "= coder slice with one step for Brian", font=F_LEG, fill=TXT); x += 430
d.text((x, y + 4), "Stories 1–8, C1, C2 = the acceptance tests each slice delivers (§A2.2)", font=F_LEG, fill=TXT)

# rows
y = HEADER_H
for r in rows:
    title = ROW_TITLES.get(r[0][0]["id"], "Row (cont.) · Stages " + ", ".join(dict.fromkeys(c[0]["id"] for c in r)))
    d.text((MARGIN, y), title, font=F_ROW, fill=TXT); y += 50
    rowh = max(col_height(c) for c in r)
    for ci, (st, part, nparts, items) in enumerate(r):
        x0 = MARGIN + ci * (COLW + GAP); yy = y
        rrect((x0, yy, x0 + COLW, yy + STAGE_H - 10), NAVY, r=12)
        label = f"Stage {st['id']}" + (f" (part {part + 1} of {nparts})" if nparts > 1 else "")
        d.text((x0 + PAD, yy + 12), label, font=F_STAGE_S, fill="#cbd5e1")
        ty = yy + 38
        result = re.sub(r"\s*\([^()]*\)\s*$", "", st["result"])   # the header shows the result; the version note stays in the PRD
        for l in wrap(result, F_STAGE, COLW - 2 * PAD)[:3]: d.text((x0 + PAD, ty), l, font=F_STAGE, fill="white"); ty += 27
        for l in wrap(st["who"], F_WHO, COLW - 2 * PAD)[:1]: d.text((x0 + PAD, yy + STAGE_H - 36), l, font=F_WHO, fill="#cbd5e1")
        if ci < len(r) - 1:
            ax = x0 + COLW + 2; ay = yy + STAGE_H // 2 - 5
            d.polygon([(ax, ay - 12), (ax + GAP - 4, ay), (ax, ay + 12)], fill=NAVY)
        yy += STAGE_H
        for kind, obj, h in items:
            if kind == "batch":
                rrect((x0, yy, x0 + COLW, yy + h), BATCHBG, outline=BORDER, r=10)
                ty = yy + PAD
                for l in wrap(obj["title"], F_CARD, TEXTW): d.text((x0 + PAD, ty), l, font=F_CARD, fill=TXT); ty += 25
                chip(x0 + PAD, ty + 4, f"batch {obj['id']}", "white", MUTED, outline=BORDER)
            elif kind == "card":
                c = obj
                fill, bar = {"done": (DONEBG, GREEN), "here": (HEREBG, AMBER), "todo": (GRAYBG, GRAY)}[c["status"]]
                rrect((x0, yy, x0 + COLW, yy + h), fill, outline=bar if c["status"] != "todo" else BORDER, r=10)
                d.rectangle((x0 + 4, yy + 8, x0 + 10, yy + h - 8), fill=bar)
                ty = yy + PAD
                cw = chip(x0 + PAD + 4, ty, c["id"], "#dfe3ea", "#374151")
                if c["status"] == "here": chip(x0 + PAD + 4 + cw + 10, ty, "You are here", RED, "white")
                ty += 32
                for l in wrap(c["title"], F_CARD, TEXTW): d.text((x0 + PAD + 4, ty), l, font=F_CARD, fill=TXT); ty += 25
                if c["done"]:
                    ty += 2
                    for l in wrap(c["done"], F_BODY, TEXTW): d.text((x0 + PAD + 4, ty), l, font=F_BODY, fill=MUTED); ty += 21
                if c["chips"] or c["stories"]:
                    ty += 6; cx = x0 + PAD + 4
                    for ch in c["chips"]: cx += chip(cx, ty, ch, "white", "#b45309", outline="#b45309") + 8
                    if c["stories"]: d.text((cx, ty + 4), c["stories"], font=F_BODY, fill=MUTED)
            else:
                rrect((x0, yy, x0 + COLW, yy + h), "white", outline=GREEN, r=10, width=3)
                d.text((x0 + PAD, yy + 12), f"COLUMN CHECK  {obj['id']}", font=F_CARD, fill=GREEN)
                d.text((x0 + PAD, yy + 40), wrap(clean(obj["text"]), F_BODY, TEXTW)[0], font=F_BODY, fill=MUTED)
            yy += h + 12
    y += rowh + 40

d.text((MARGIN, total_h - 40), f"Source: docs/PRD-aadm-delivery-maps.md §18 ({version}); rendered by docs/scripts/render_delivery_map.py. Blueprint's own v0.16 render is on Brian's Desktop and is not changed.", font=F_BODY, fill=MUTED)
img.save(OUT)

# structure sidecar for F2-e2
struct = {"version": version, "stages": [{"id": st["id"], "result": st["result"], "check": st["check"]["id"] if st["check"] else None,
          "batches": [{"id": b["id"], "title": b["title"], "cards": [{"id": c["id"], "status": c["status"], "title": c["title"]} for c in b["cards"]]} for b in st["batches"]]} for st in stages]}
here = [c["id"] for st in stages for b in st["batches"] for c in b["cards"] if c["status"] == "here"]
struct["you_are_here"] = here[0] if here else None
struct["counts"] = {"stages": len(stages), "batches": sum(len(st["batches"]) for st in stages), "slices": sum(len(b["cards"]) for st in stages for b in st["batches"]),
                    "done": sum(1 for st in stages for b in st["batches"] for c in b["cards"] if c["status"] == "done")}
open(OUT.rsplit(".", 1)[0] + ".json", "w", encoding="utf-8").write(json.dumps(struct, indent=1, ensure_ascii=False))
print(json.dumps(struct["counts"]), "you_are_here:", struct["you_are_here"], "size:", img.size)
