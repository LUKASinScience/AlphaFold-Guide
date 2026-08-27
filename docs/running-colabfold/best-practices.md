---
icon: lucide/file-check-2
---

# Presenting & Sharing AlphaFold Results

Once you trust a prediction (see [Confidence Metrics](../interpreting-results/confidence-metrics.md)), the next failure mode is presenting it in a way that misleads readers or can't be reproduced. This page summarizes practical reporting norms drawn from the [ASBC AlphaFold best-practices guide](https://australian-structural-biology-computing.github.io/website/best-practices-alphafold).

!!! info "Beginner: the minimum every figure/methods section needs"
    - **Label it as a model.** State explicitly in the figure or legend that a structure is an AlphaFold/ColabFold *prediction*, not an experimentally determined structure.
    - **Show confidence alongside the structure**, not just the cartoon: a pLDDT-colored model *and* a PAE plot, each with its color key.
    - **Report pTM / ipTM** (the latter for complexes) in the figure or a supplementary table.
    - **Name the exact tool and version**: AlphaFold2, AlphaFold3, ColabFold, LocalColabFold, or OpenFold are not interchangeable — say which one, and which version.

!!! tip "Advanced: what to include in Methods"
    - Model type, number of recycles, early-stopping tolerance, whether Amber relaxation was applied, and random seed(s) used.
    - Which sequence databases were queried (not applicable for AlphaFold3, which uses its own internal pipeline).
    - Enough detail that someone else could reproduce the run — link a GitHub repo or container definition if you modified anything from defaults.
    - Cite the primary literature for whichever tool you used: Jumper et al. 2021 for AlphaFold2, Evans et al. for AlphaFold-Multimer, Mirdita et al. 2022 for ColabFold, Ahdritz et al. for OpenFold.

??? example "Expert: full data-sharing checklist"
    - Input sequences as FASTA or a supplementary table, with subunits clearly identified for multimeric predictions.
    - All five ranked `.pdb`/`.cif` models plus their matching `.json` PAE files, deposited via ModelArchive, GitHub, or Figshare — not just the top-ranked model.
    - For AlphaFold3: the `.json` input file(s), since these are what preserve post-translational modifications and ligand specifications — without them the run isn't reproducible.
    - Any custom/non-standard scripts used to prepare inputs or postprocess outputs.
    - `.a3m` MSA files where feasible — large size can be a reason to omit them, but only if the methods section describes exactly how to regenerate them.
    - Show *all five* models superposed at least once (even if only in supplementary material) to demonstrate — or expose — consistency across AlphaFold's independent predictions, rather than cherry-picking the best-looking one.

## Why this matters: confident-looking ≠ correct

??? example "Expert: the evidence for skepticism"
    This isn't a theoretical concern. [Terwilliger et al. (2023/2024, Nature Methods)](https://www.biorxiv.org/content/10.1101/2022.11.21.517405v2) compared AlphaFold predictions against experimental maps and found that even confidently-predicted regions can diverge from the real structure — at the **global scale** (domain orientation, overall distortion) and at the **local scale** (backbone and side-chain conformation). Their conclusion, worth internalizing: *AlphaFold predictions are valuable hypotheses that accelerate but do not replace experimental structure determination.* Practical implication for anyone publishing: treat a prediction as strong evidence to design the next experiment around, not as a substitute for that experiment — particularly for any interaction or ligand/cofactor binding site that wasn't part of the original prediction input.

    For a broader treatment of AF2's practical strengths, failure modes, and how to responsibly improve a raw prediction before using it downstream (e.g. adding missing cofactors/ligands via [AlphaFill](https://alphafill.eu/), or disulfide bridges via MODELLER), see [Sun et al., "AlphaFold2 for Protein Structure Prediction: Best Practices and Critical Analyses" (2024)](https://arxiv.org/abs/2403.12668).

## Common mistakes to avoid

- Presenting a model without ever calling it a "prediction" or "computational model."
- Showing a cartoon with no confidence coloring, PAE plot, or pTM/ipTM anywhere in the paper.
- Reporting only the single top model, with no indication of agreement/disagreement across the other four.
- Vague methods ("we ran AlphaFold") with no version, parameters, or database information — this alone can make a result irreproducible.
- Forgetting citations for the specific pipeline used (ColabFold citations are commonly dropped even when ColabFold, not the original AlphaFold2 pipeline, was actually used).

## MSA depth as a sanity check

Before even looking at the 3D structure, check the **sequence coverage / MSA depth plot** that ColabFold outputs alongside the model. As a rule of thumb, roughly **200+ sequences** in the alignment at a given position is associated with confident predictions there; regions with much shallower coverage (well below ~100 sequences) are a leading indicator of an unreliable region, often before pLDDT even reflects it clearly. Recommended reading order for a fresh result: **coverage plot → pLDDT plot → PAE plot → 3D structure** — in that order, so you form an expectation of reliability before the cartoon can bias you.

See also: [Confidence Metrics](../interpreting-results/confidence-metrics.md) for what pLDDT/PAE/ipTM actually measure, and [ChopChopMF Workflows](../chopchopmf/workflows.md) for generating these views interactively in ChimeraX.

Continue to [Visualization Tools →](../visualization-tools.md)
