---
icon: lucide/life-buoy
---

# Troubleshooting & Common Pitfalls

A quick-lookup page for "something seems off" moments — organized by symptom, not by tool. Each row links to the page with the full explanation; this page is for finding the right row fast, not for reading start to finish.

## Reading a prediction

| Symptom | Likely cause | Where to read more |
|---|---|---|
| A region looks confidently folded (high pLDDT) but you know it's disordered | Conditionally-folded IDR — AlphaFold can predict the *bound* or *modified* conformation with high confidence even from a naked sequence | [pLDDT is not a clean disorder detector](interpreting-results/confidence-metrics.md#plddt-per-residue-local-confidence) |
| A clean-looking helix has low pLDDT | Probably a real signal, not noise — likely a transient/conditional helix, or (in AlphaFold3 specifically) a hallucinated one | [Confidence Metrics](interpreting-results/confidence-metrics.md#plddt-per-residue-local-confidence) |
| Two domains each look great individually, but you're not sure about their arrangement | pLDDT can't tell you — that's what PAE is for | [Why do I need PAE if I already have pLDDT?](interpreting-results/confidence-metrics.md#pae-predicted-aligned-error) |
| Two chains are touching in the 3D view — are they really interacting? | Not necessarily. AlphaFold/ColabFold always places chains near each other in a multimer job, even with no real interaction | [Chance or determination?](interpreting-results/confidence-metrics.md#pae-predicted-aligned-error) |
| ipTM varies a lot across the 5 models for the same complex | Not a bug — can be a real signal of interface ambiguity, or one outlier among four agreeing models | [Real-world example](interpreting-results/confidence-metrics.md#ptm-and-iptm-one-number-for-a-whole-structure-or-interface) |
| You mutated a residue in silico and pLDDT barely changed (or moved the "wrong" way) | Expected — AF2 is largely insensitive to point mutations; pLDDT often doesn't track real stability effects | [What Actually Influences a Prediction?](interpreting-results/what-influences-a-prediction.md) |
| A PTM you specified doesn't seem to change anything | You're using AlphaFold2/ColabFold — they have no PTM representation at all. Only AlphaFold3 supports PTMs as explicit input | [What Actually Influences a Prediction?](interpreting-results/what-influences-a-prediction.md) |

## AlphaMissense

| Symptom | Likely cause | Where to read more |
|---|---|---|
| AlphaMissense fetch returns nothing for your protein | It's not human, or not the canonical sequence — scores only exist natively for human canonical UniProt sequences | [Using AlphaMissense on a non-human protein](interpreting-results/alphamissense.md#using-alphamissense-on-a-non-human-protein) |
| Residue numbering seems off vs. what you expected from AlphaFold DB | You may be looking at an isoform-specific entry, or a canonical one when you needed an isoform (or vice versa) | [Check which sequence you're actually looking at](interpreting-results/alphamissense.md#where-to-find-alphamissense-scores) |
| A score seems too extreme / doesn't match known clinical classification | AlphaMissense over-predicts pathogenicity in some benchmarks and is *supporting* evidence only, never standalone | [Known limitations](interpreting-results/alphamissense.md#what-its-useful-for-and-what-it-isnt) |

## ChopChopMF

| Symptom | Likely cause | Fix |
|---|---|---|
| Crop/Delete removed too much and can't be undone | No duplicate made first | Always **Duplicate Structure** before a destructive edit — see [Trimming a model](chopchopmf/workflows.md#3-trimming-a-model-before-downstream-analysis) |
| PAE Contacts tool won't run / gives odd results | More than one model open | Close/hide other models — only one is supported |
| Foldseek hits look noisy or miss the obvious homolog | Flexible/disordered regions still in the model, or cropped down to a single helix/sheet | Crop a *complete* domain first — see [Finding structural homologs](chopchopmf/workflows.md#4-finding-structural-homologs-foldseek) |
| Foldseek finds nothing for a poorly characterized organism | Searched PDB only | Switch the target database to AlphaFold DB (afdb50) |
| ΔG plot dominated by tiny values | Neutral band toggle off | Leave **Neutral band (±ε)** checked |

## Running ColabFold / HPC

| Symptom | Likely cause | Where to read more |
|---|---|---|
| A run is spending most of its time before inference even starts | Expected — MSA search (not the network) is the classic AF2 bottleneck, historically ~80%+ of wall-clock time | [AF2 vs. ColabFold: same brain, faster search](fundamentals/af2-vs-colabfold-vs-af3.md#alphafold2-vs-colabfold-same-brain-faster-search) |
| AlphaFold3 container won't run on an older cluster | CUDA version mismatch — AF3 needs CUDA 12.3+, older cluster drivers may only support 12.2 | [Running ColabFold (local/HPC)](running-colabfold/hpc-and-local.md) — containerize with Apptainer |
| AlphaFold Server rejects a job or a ligand/ion | Server enforces a 5,000-token cap and only supports a specific ion list (MG, ZN, CL, CA, NA, MN, K, FE, CU, CO) | [AlphaFold3 & AlphaFold Server practical limits](fundamentals/af2-vs-colabfold-vs-af3.md#alphafold3-alphafold-server-a-genuinely-different-model) |

## Still stuck?

Check [Resources & Further Reading](resources.md) for primary sources, or — for the tools themselves rather than this guide's explanations — report it directly where they're maintained: [ChopChopMF issues](https://github.com/LUKASinScience/ChopChopMF/issues) · [ChimeraX-FigureStyle issues](https://github.com/LUKASinScience/ChimeraX-FigureStyle/issues).
