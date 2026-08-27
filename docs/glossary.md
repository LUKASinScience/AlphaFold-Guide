---
icon: lucide/book-a
---

# Glossary

Quick reference for every acronym and term used across this guide. Each entry links to the page where it's actually explained in depth — this page is for looking something up mid-read, not for learning it the first time.

**AlphaFold-Multimer**
: The complex/multi-chain prediction mode of AlphaFold2. See [AlphaFold-Multimer version history](fundamentals/af2-vs-colabfold-vs-af3.md#multimer-support-how-we-got-here).

**AlphaMissense**
: A separate DeepMind model, built on AlphaFold2's architecture, that scores human missense variants for likely pathogenicity. See [What is AlphaMissense?](interpreting-results/alphamissense.md)

**BFD** (Big Fantastic Database)
: The largest of the sequence databases AlphaFold2/ColabFold search for MSA construction — dominates the ~2.6 TB database bundle size. See [Running ColabFold (local/HPC)](running-colabfold/hpc-and-local.md).

**Evoformer**
: AlphaFold2's central trunk network — 48 blocks jointly refining the MSA and pair representations. See [How AlphaFold Works](fundamentals/how-alphafold-works.md).

**Foldseek**
: A structure-search tool that finds structural homologs by converting structures into a "3Di" structural alphabet — far more sensitive than sequence search for distant relatives. See [Structure vs. Sequence Homology](fundamentals/structure-vs-sequence-homology.md) and the [ChopChopMF Foldseek workflow](chopchopmf/workflows.md#4-finding-structural-homologs-foldseek).

**IDR** (Intrinsically Disordered Region)
: A part of a protein with no single fixed 3D structure — better described as a conformational ensemble. Frequently shows low pLDDT. See [Confidence Metrics](interpreting-results/confidence-metrics.md).

**ipTM** (interface predicted TM-score)
: A 0–1 confidence score for the interface between chains in a predicted complex — the single most useful number for "is this predicted interaction believable?" See [pTM and ipTM](interpreting-results/confidence-metrics.md#ptm-and-iptm-one-number-for-a-whole-structure-or-interface).

**MSA** (Multiple Sequence Alignment)
: An alignment of many homologous sequences to a query — the dominant source of information AlphaFold uses to predict structure. See [How AlphaFold Works](fundamentals/how-alphafold-works.md) and [What Actually Influences a Prediction?](interpreting-results/what-influences-a-prediction.md).

**PAE** (Predicted Aligned Error)
: A pairwise, per-residue-pair confidence measure in Ångströms — how sure AlphaFold is about the *relative* position of two residues. See [PAE — Predicted Aligned Error](interpreting-results/confidence-metrics.md#pae-predicted-aligned-error).

**Pairformer**
: AlphaFold3's trunk network, replacing the Evoformer — keeps the pair/single representations but uses a much lighter MSA module. See [How AlphaFold Works](fundamentals/how-alphafold-works.md).

**PDE** (Predicted Distance Error)
: An AlphaFold3-specific confidence metric — pairwise distance accuracy independent of frame alignment, related to but distinct from PAE. See [Confidence Metrics](interpreting-results/confidence-metrics.md#pae-predicted-aligned-error).

**pLDDT** (predicted Local Distance Difference Test)
: A 0–100 per-residue (or, in AF3, per-atom) confidence score. See [pLDDT — per-residue local confidence](interpreting-results/confidence-metrics.md#plddt-per-residue-local-confidence).

**pTM** (predicted TM-score)
: A 0–1 confidence score summarizing the accuracy of an entire predicted fold in one number. See [pTM and ipTM](interpreting-results/confidence-metrics.md#ptm-and-iptm-one-number-for-a-whole-structure-or-interface).

**PTM** (Post-Translational Modification)
: A biochemical modification made to a protein after translation (phosphorylation, glycosylation, etc.) — not modeled at all by AlphaFold2, but explicitly supported as input by AlphaFold3. See [What Actually Influences a Prediction?](interpreting-results/what-influences-a-prediction.md).

**Recycling**
: Feeding AlphaFold's own output back into the start of the trunk network for multiple refinement passes. See [How AlphaFold Works](fundamentals/how-alphafold-works.md).

**Remote homology**
: A relationship between two proteins that share a common ancestor so distant that sequence alignment can no longer detect it, even though structure still can. See [Structure vs. Sequence Homology](fundamentals/structure-vs-sequence-homology.md).

**Twilight zone**
: The pairwise sequence-identity range (roughly below 20–25%) where sequence-alignment scores become statistically indistinguishable from chance. See [Structure vs. Sequence Homology](fundamentals/structure-vs-sequence-homology.md).

Missing a term? This guide is a living document — see [Resources & Further Reading](resources.md) for the primary sources everything here is drawn from.
