---
icon: lucide/library-big
---

# Resources & Further Reading

The primary sources this guide is built from, plus additional reading for anyone who wants to go deeper than a single guide can.

## Official documentation & courses

- [EBI Training: AlphaFold course](https://www.ebi.ac.uk/training/online/courses/alphafold/) — the most comprehensive free course covering AF2, AF-Multimer, AF3, and AlphaFold Server, including confidence-metric modules referenced throughout this guide.
- [AlphaFold Server guides](https://alphafoldserver.com/guides) — official usage guidance for the AF3 web portal.
- [google-deepmind/alphafold3 — docs/output.md](https://github.com/google-deepmind/alphafold3) — technical output format and confidence-head details.
- [google-deepmind/alphafold — technical note v2.3.0](https://github.com/google-deepmind/alphafold/blob/main/docs/technical_note_v2.3.0.md) — AlphaFold-Multimer training-cutoff/parameter update details.
- [ChopChopMF usage docs](https://lukasinscience.github.io/ChopChopMF/usage/) — the ChimeraX plug-in covered in this guide's [ChopChopMF section](chopchopmf/index.md).

## Mechanism deep-dives

- [The Illustrated AlphaFold](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/) — Elana Simon's detailed, diagram-heavy walkthrough of AlphaFold3's architecture (Pairformer, diffusion module, confidence heads); the single best source for AF3 internals.
- [AlphaFold 2 is here: what's behind the structure prediction miracle](https://www.blopig.com/blog/2021/07/alphafold-2-is-here-whats-behind-the-structure-prediction-miracle/) — Oxford Protein Informatics Group's clear explainer of the Evoformer, IPA, and training losses.
- [Deep Learning for Biology and AlphaFold](https://theaisummer.com/deep-learning-biology-alphafold/) — AI Summer's treatment of the attention mechanisms underlying AF2.

## Confidence metrics & interpretation

- [EBI: pLDDT — Understanding Local Confidence](https://www.ebi.ac.uk/training/online/courses/alphafold/inputs-and-outputs/evaluating-alphafolds-predicted-structures-using-confidence-scores/plddt-understanding-local-confidence/)
- [EBI: What AlphaFold 3 struggles with](https://www.ebi.ac.uk/training/online/courses/alphafold/alphafold-3-and-alphafold-server/introducing-alphafold-3/what-alphafold-3-struggles-with/) — spurious/hallucinated helices in disordered regions.
- [AlphaFold2: A Role for Disordered Protein/Region Prediction?](https://pmc.ncbi.nlm.nih.gov/articles/PMC9104326/) (PMC9104326) — pLDDT vs. conformational ensembles, transient helices.
- [Systematic identification of conditionally folded intrinsically disordered regions by AlphaFold2](https://pmc.ncbi.nlm.nih.gov/articles/PMC10622901/) (PMC10622901) — conditional/binding-induced folding and deceptively high pLDDT.
- [PAE Viewer](https://pae-viewer.uni-goettingen.de/) — standalone tool for full-complex PAE heatmaps.

## AlphaMissense

- Cheng et al., *"Accurate proteome-wide missense variant effect prediction with AlphaMissense,"* Science 381, 2023 (DOI 10.1126/science.adg7492).
- [AlphaMissense functional-assay correlation benchmark](https://pmc.ncbi.nlm.nih.gov/articles/PMC10634779/) (PMC10634779) — comparison against REVEL, PrimateAI-3D and deep mutational scanning data.
- [google-deepmind/alphamissense](https://github.com/google-deepmind/alphamissense) — reference code and data-access documentation.

## Structure homology & Foldseek

- [van Kempen et al., "Fast and accurate protein structure search with Foldseek"](https://www.nature.com/articles/s41587-023-01773-0), Nature Biotechnology 2023 — the 3Di structural-alphabet search method behind ChopChopMF's Foldseek tool.
- [Foldseek GitHub repository](https://github.com/steineggerlab/foldseek)
- [EBI: AlphaFold DB + Foldseek integration announcement](https://www.ebi.ac.uk/about/news/updates-from-data-resources/alphafold-foldseek/) (Sept 2024)
- [EBI training: Using the AlphaFold database for analysis](https://www.ebi.ac.uk/training/online/courses/alphafold/accessing-and-predicting-protein-structures-with-alphafold/accessing-predicted-protein-structures-in-the-alphafold-database/using-the-alphafold-database-for-analysis/)
- [Neurosnap: Foldseek Structural Clustering](https://neurosnap.ai/how-to-use/Foldseek%20Structural%20Clustering)
- [310.ai: Hide and seek — structure similarities with Foldseek](https://310.ai/blog/hide-and-seek-structure-similarities-with-foldseek)
- [PAE Viewer paper](https://academic.oup.com/nar/article/51/W1/W404/7151339) — background on interface/PAE-based confidence for multimer predictions.

## Running AlphaFold/ColabFold

- [Boost AlphaFold2 Protein Structure Prediction with GPU-Accelerated MMseqs2](https://developer.nvidia.com/blog/boost-alphafold2-protein-structure-prediction-with-gpu-accelerated-mmseqs2/) (NVIDIA)
- [GPU-accelerated MSA preprint](https://www.biorxiv.org/content/10.1101/2024.11.13.623350v5)
- [ColabFold: making protein folding accessible to all](https://www.nature.com/articles/s41592-022-01488-1), Mirdita et al., Nature Methods 2022.
- [Highly accurate protein structure prediction with AlphaFold](https://www.nature.com/articles/s41586-021-03819-2), Jumper et al., Nature 2021.
- [Protein complex prediction with AlphaFold-Multimer](https://www.biorxiv.org/content/10.1101/2021.10.04.463034v2), Evans et al.
- [From interaction networks to interfaces, scanning intrinsically disordered regions using AlphaFold2](https://www.nature.com/articles/s41467-023-44288-7)
- [University of Chicago RCC: AlphaFold](https://docs.rcc.uchicago.edu/software/apps-and-envs/alphafold/)
- [NSC Berzelius: AlphaFold](https://www.nsc.liu.se/support/systems/berzelius-software/berzelius-alphafold/)
- [Yale YCRC: AlphaFold](https://docs.ycrc.yale.edu/clusters-at-yale/guides/alphafold/)
- [ASBC: Best practices for presenting AlphaFold models](https://australian-structural-biology-computing.github.io/website/best-practices-alphafold)
- [ASBC: AlphaFold2 how-to guide](https://australian-structural-biology-computing.github.io/website/AlphaFold2_how_to_guide)
- [Terwilliger et al., "AlphaFold predictions are valuable hypotheses, and accelerate but do not replace experimental structure determination"](https://www.biorxiv.org/content/10.1101/2022.11.21.517405v2), Nature Methods 2023/2024 — concrete evidence that confidently-predicted regions can still diverge from experimental structures.
- [Sun et al., "AlphaFold2 for Protein Structure Prediction: Best Practices and Critical Analyses"](https://arxiv.org/abs/2403.12668) (2024)

## Beginner-friendly explainers

- [How AlphaFold2 Revolutionized the Way We Do Biology (Pt 1)](https://neurosnap.ai/blog/post/641a34a1148354cbab382afe)
- [How to Use AlphaFold2 as a Wet Lab Biologist (Pt 2)](https://neurosnap.ai/blog/post/64222437a55063d26e9c069e) / [Pt 3](https://neurosnap.ai/blog/post/6422432aa55063d26e9c06a1)
- [thenode.biologists.com — AlphaFold protein interaction modeling tutorial](https://thenode.biologists.com/https-www-youtube-com-watchvu63oyfwdbomt4180s/education/) — pointer to David Fay's tutorial/workshop video on modeling protein interactions and reading AlphaFold's confidence output.

## Tooling used to build this guide

- [Zensical](https://zensical.org/docs/) — the static site generator this guide is built with (`zensical serve` / `zensical build`).
