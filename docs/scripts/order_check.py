#!/usr/bin/env python3
"""Order check over PRD §18 (docs/PRD-aadm-delivery-maps.md): back-references, folded refs, batch sizes, counts.

Usage: python3 docs/scripts/order_check.py docs/PRD-aadm-delivery-maps.md > report.json
A finding is a slice whose *In:* or body names a slice that runs later or no longer exists, or a batch header that does.
ACCEPTED lists the forward mentions the text states on purpose; everything else is `residue` and is a defect to fix.
The two later-stage lines (DMT-b4 reads DM2-m1; DM6-s after DM6-d) are known residue left for the later-stage pass (§20)."""
import re, sys, json

path = sys.argv[1]
lines = open(path, encoding="utf-8").read().split("\n")

# locate §18 .. §19
s = next(i for i, l in enumerate(lines) if l.startswith("## 18. "))
e = next(i for i, l in enumerate(lines) if l.startswith("## 19. "))
sec = lines[s:e]

ID = r"(?:DM[0-9]|DMT|DMF|F[0-9])-[a-z][0-9]"
id_re = re.compile(r"`?(" + ID + r")`?")
slice_line = re.compile(r"^\s*- `(" + ID + r")`")
batch_line = re.compile(r"^- Batch `([A-Za-z0-9]+-[a-z])`")
stage_line = re.compile(r"^\*\*Stage ([^:]+):")
fold_row = re.compile(r"^\| `?(" + ID + r")`? \| `?(" + ID + r")`? \|")

order = {}      # id -> position
done = set()
stage_of = {}
batch_of = {}
batches = {}    # batch -> [ids]
bodies = {}     # id -> text
folded = {}     # old -> new

cur_stage = cur_batch = cur_slice = None
pos = 0
in_fold = False
for l in sec:
    if "Where the 57 removed" in l or "Where the" in l and "removed v0.15 slices went" in l:
        in_fold = True
    if in_fold:
        m = fold_row.match(l)
        if m:
            folded[m.group(1)] = m.group(2)
        continue
    m = stage_line.match(l)
    if m:
        cur_stage = m.group(1).strip(); cur_batch = None; cur_slice = None; continue
    m = batch_line.match(l)
    if m:
        cur_batch = m.group(1); batches.setdefault(cur_batch, []); cur_slice = None
        bodies[cur_batch] = l
        continue
    m = slice_line.match(l)
    if m and cur_batch:
        sid = m.group(1); pos += 1
        order[sid] = pos; stage_of[sid] = cur_stage; batch_of[sid] = cur_batch
        batches[cur_batch].append(sid); bodies[sid] = l; cur_slice = sid
        if "✅" in l or "**DONE" in l:
            done.add(sid)
        continue
    if cur_slice and l.startswith("    "):
        bodies[cur_slice] += "\n" + l
    elif cur_batch and not cur_slice and l.startswith("  "):
        bodies[cur_batch] += "\n" + l

WAS = re.compile(r"\((?:was|were|now in) [^)]*\)")
def refs_in(text):
    return [x for x in id_re.findall(WAS.sub("", text))]

# forward mentions that are explicit in the text (a slice says a later slice will extend, read or replace it)
ACCEPTED = {
 ("DM0-b1","DM0-b2"): "names the seam DM0-b2 uses next",
 ("DM0-b1","F1-a3"): "v0.19: empty verb registry that F1-a3 fills (stated)",
 ("DM0-b2","F1-a3"): "v0.19: no tool uses the client until F1-a3 (stated)",
 ("DM0-b2","DM0-b3"): "v0.19: ASK, Brian sets the machine key before DM0-b3 (stated)",
 ("DM0-b4","DM0-d2"): "reports unset until DM0-d2 makes the setting required (stated)",
 ("DM0-d2","DM2-a3"): "refusal bodies stay as today until DM2-a3 (stated)",
 ("DM0-d2","DM2-a4"): "history note: the boot half of v0.14's DM2-a4",
 ("DM0-e2","F5-a1"): "names the tests F5-a1 will own",
 ("DM1-e4","F2-b1"): "rollback: nothing calls it until F2-b1 (stated)",
 ("DM1-e4","DM1-f1"): "rule R2: sentinel until DM1-f1 lands",
 ("DM1-e5","F1-a3"): "routes declare the fields as F1-a3 adds them (stated)",
 ("DM1-e5","DM6-p3"): "filtering stays off until DM6-p3 (stated)",
 ("DM2-a3","F5-a3"): "the website contract test lives in F5-a3 (stated)",
 ("F2-b2","F2-d1"): "the judge reads the list (stated)",
 ("DM6-g6","DM6-s1"): "later judgments join the parity test when they land (stated)",
 ("DM6-g6","DM6-d1"): "same", ("DM6-g6","DM6-d2"): "same", ("DM6-g6","DM1-f1"): "rule R2",
 ("DM6-c3","DM6-c1"): "keep: result shape read by DM6-c1 later (stated)",
 ("DM6-a4","DM6-h2"): "reason for the move (stated)", ("DM6-a4","DM6-h9"): "same",
 ("DM6-h1","DM6-h2"): "stub until DM6-h2 (stated)",
 ("DM7-c2","DM7-a4"): "uses the existing core tool; DM7-a4 reuses it later (stated)",
 ("DM7-a2","DM1-f1"): "rule R2",
 ("DM0-d1","F1-a3"): "ids added once F1-a3 resolves them (stated)", ("F3-b1","F3-b4"): "plan_kind confirmed by F3-b4 (stated)",
 ("F3-a2","DM2-o1"): "its own absorbs (lowercase 'absorbs')", ("F3-a2","DM2-o2"): "same", ("F3-a2","DM2-o3"): "same", ("F3-a2","DM2-b1"): "same", ("F3-a2","DM2-b2"): "same",
 ("DM0-a","DM0-a3"): "header history: added in v0.7", ("DM0-a","DM0-b1"): "header history: before DM0-b1", ("DM1-e","DM1-e3"): "header history: v0.12 adds DM1-e3",
 ("F1-r","DM6-g6"): "header: moved out in v0.16.1", ("F5-s","DM6-c3"): "header: moved in", ("F5-s","DM6-a5"): "header: moved in",
 ("DM6-p","DM6-c"): "header: 'v0.16 said after DM6-c'", ("DM7-c","DM7-b"): "header: 'v0.16 said after DM7-b'",
 # v0.17 (D53): stated forward mentions after the reflow to Stage V and Stage H
 ("DM0-c2","DM0-c1"): "v0.17: reads the draft; DM0-c1 publishes Part 1 later in H (stated)",
 ("F1-a1","DM1-c4"): "v0.17: minimal runner now; DM1-c4's lint and runbook later in H (stated)",
 ("DM1-e4","DM1-e3"): "v0.17: DM1-e3 extends its check to the registry when it lands in H (stated)",
 ("DM1-e4","F2-b0"): "rollback note: nothing calls it until F2-b0 (stated)",
 ("F2-b0","F3-b3"): "F3-b3 later passes a signed version into the same verb (stated)",
 ("F2-c3","F1-b1"): "builds the report-side filter; F1-b1 proves it on every verb later in V (stated)",
 ("DM0-b","DM0-b2"): "header: DM0-b1 and DM0-b2 rewritten with their prompts (stated)",
 ("V-a","DM0-c2"): "header names its own slices and what reads them", ("V-a","F2-b0"): "same", ("V-a","F2-b1"): "same", ("V-a","F1-a1"): "same",
 ("F2-a","F2-a3"): "header: moved to H-a (stated)", ("F2-d","DM6-g6"): "header: moved to H-b (stated)", ("F2-d","F2-d2"): "header: moved to H-b (stated)",
 ("F2-d","F2-e1"): "header: moved in", ("F2-d","F1-b1"): "header: moved in",
 ("DM0-c","DM0-c3"): "header names its own slice", ("H-a","F2-a3"): "header names its own slice", ("H-b","F2-e2"): "same", ("H-b","DM6-g6"): "same",
 ("DM0-d","DM0-c"): "header history: v0.16 said after DM0-c",
 # v0.18 (D54)
 ("F2-b0","F2-b1"): "done-check example: move DM0-c2 after F2-b1 on the imported roadmap (stated)",
 ("DM0-b","DM0-b4"): "header: moved to F4-g (stated)", ("F4-g","F4-a2"): "header: lands before the relay in F4-a2 (stated)",
 ("H-a","F1-b1"): "header names its own slice",
 ("F1-a1","DM0-b4"): "v0.19: release nullable until DM0-b4 fills it (stated)",
 ("F1-a3","DM0-d1"): "v0.19: DM0-d1 later moves core onto the same context (stated)",
 ("DM0-j","F1-a3"): "v0.19: rules land before F1-a3 builds against them (stated)",
 ("DM0-j","F1-a1"): "v0.19: rules land before F1-a1 builds against them (stated)",
 ("DM0-j","DM0-b1"): "v0.19: DM0-j runs before DM0-b1 (stated)",
}

report = {"slices": len(order), "batches": len(batches), "done": sorted(done),
          "folded_count": len(folded), "batch_size_violations": {}, "findings": []}

for b, ids in batches.items():
    if not (2 <= len(ids) <= 4):
        report["batch_size_violations"][b] = len(ids)

for sid, text in bodies.items():
    if sid not in order:   # batch header
        continue
    # In: clause
    m = re.search(r"\*In:\*(.*?)(\*Out:\*|$)", text, re.S)
    in_refs = refs_in(m.group(1)) if m else []
    absorbs = set()
    for am in re.finditer(r"Absorbs ([^.]*)\.", text):
        absorbs.update(refs_in(am.group(1)))
    body_refs = set(refs_in(text)) - {sid}
    for r in in_refs:
        if r in folded and r not in absorbs:
            report["findings"].append({"slice": sid, "stage": stage_of[sid], "kind": "IN_REFS_FOLDED", "ref": r, "folded_into": folded[r]})
        elif r in order and order[r] > order[sid] and r not in done:
            report["findings"].append({"slice": sid, "stage": stage_of[sid], "kind": "IN_BACKREF", "ref": r, "ref_stage": stage_of[r]})
        elif r not in order and r not in folded:
            report["findings"].append({"slice": sid, "stage": stage_of[sid], "kind": "IN_UNKNOWN", "ref": r})
    for r in body_refs - set(in_refs) - absorbs:
        if r in folded:
            report["findings"].append({"slice": sid, "stage": stage_of[sid], "kind": "BODY_REFS_FOLDED", "ref": r, "folded_into": folded[r]})
        elif r in order and order[r] > order[sid] and r not in done and sid not in done:
            report["findings"].append({"slice": sid, "stage": stage_of[sid], "kind": "BODY_BACKREF", "ref": r, "ref_stage": stage_of[r]})

# batch header "after X" refs
for b, text in bodies.items():
    if b in order: continue
    first = batches[b][0] if batches[b] else None
    for r in set(refs_in(text)):
        if first and r in order and order[r] > order[first] and r not in done:
            report["findings"].append({"batch": b, "kind": "BATCH_HEADER_BACKREF", "ref": r, "ref_stage": stage_of[r]})
        if r in folded:
            report["findings"].append({"batch": b, "kind": "BATCH_HEADER_REFS_FOLDED", "ref": r, "folded_into": folded[r]})

# batch-letter references like "after DM6-c" / "DM2-m"
blet = re.compile(r"\b((?:DM[0-9]|DMT|DMF)-[a-z])\b(?![0-9])")
for b, text in bodies.items():
    if b in order: continue
    first = batches[b][0] if batches[b] else None
    for r in set(blet.findall(text)):
        if r in batches and first and batches[r] and order[batches[r][0]] > order[first]:
            report["findings"].append({"batch": b, "kind": "BATCH_HEADER_BATCH_BACKREF", "ref": r})

residue=[]
for f in report["findings"]:
    key=(f.get("slice") or f.get("batch"), f["ref"])
    if key in ACCEPTED: f["accepted"]=ACCEPTED[key]
    else: residue.append(f)
report["accepted_count"]=len(report["findings"])-len(residue)
report["residue"]=residue
print(json.dumps(report, indent=1))
