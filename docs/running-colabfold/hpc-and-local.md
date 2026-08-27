---
icon: lucide/server
---

# Running ColabFold Locally & on HPC

Once you outgrow the free tier of [ColabFold's own Colab notebook](https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb) (batch jobs, custom databases, commercial use, or just tired of session timeouts), you'll run ColabFold or AlphaFold directly — either on your own workstation or on a shared HPC cluster.

## Do you actually need a cluster?

!!! info "Beginner"
    ColabFold needs a decent GPU and a lot of disk space for its reference databases (the full AlphaFold-style bundle is roughly **2.6 TB unzipped**, dominated by the ~1.8 TB **BFD** database). If you don't have that locally, an HPC cluster or `LocalColabFold` on a lab workstation with a single capable GPU (≥ V100-class, ideally more VRAM for larger complexes) is the practical path. Exact module names, GPU generations, and scheduler flags differ from site to site — the specifics further down are cited examples, not universal specs.

## The pattern: split the slow CPU search from the fast GPU inference

!!! tip "Advanced"
    The historically slow part of an AlphaFold2-style pipeline isn't the neural network — it's the **MSA search** (`jackhmmer` against UniRef90/MGnify, `HHblits` against BFD/UniRef30), which is CPU-bound and can consume roughly **80%+ of total wall-clock time** on the original pipeline. This motivates two related practices seen on real clusters:

    1. **Run the MSA/template search on CPU-only nodes, and inference on GPU nodes separately** — don't tie up an expensive GPU allocation while waiting on CPU-bound sequence search. One common wrapper-script pattern (see the cluster examples below) exposes this directly via a `-F true/false` "feature-only" flag: run once with `-F true -g false` to produce features only, then again with `-F false -g true` on a GPU node to run inference from the cached features.
    2. **Or skip the search entirely — use ColabFold/MMseqs2.** This is the same problem ColabFold was built to solve (see [AF2 vs. ColabFold vs. AF3](../fundamentals/af2-vs-colabfold-vs-af3.md)): MMseqs2-based search is dramatically faster, which is why `LocalColabFold` is commonly the pre-installed "fast path" module on HPC systems alongside native AlphaFold.

## FASTA input format: monomer vs. multimer

!!! info "Beginner"
    A FASTA file is plain text: a `>` header line, then the sequence.

    ```text
    >my_protein
    MSTNPKPQRKTKRNTNRRPQDVKFPGGGQIVGGVYLLPRRGPRLGVRATRKTSERSQPR
    ```

    That's all a **monomer** prediction needs, in either AlphaFold2/AlphaFold-Multimer or ColabFold.

!!! tip "Advanced: monomer vs. multimer — two genuinely different conventions"
    Once you're predicting a complex, native AlphaFold-Multimer and ColabFold expect the input arranged **differently** — mixing the two up is an easy early mistake:

    - **Native AlphaFold-Multimer** (`run_alphafold.py --model_preset=multimer`): one FASTA file, **multiple separate `>` records** — one per chain. Repeat a record for extra copies of the same chain (homomer), use different records for different chains (heteromer):

        ```text
        >chain_A
        SEQUENCEA...
        >chain_A_copy2
        SEQUENCEA...
        >chain_B
        SEQUENCEB...
        ```

        (a homodimer of chain A plus one copy of chain B — source: [Yale YCRC AlphaFold guide ↗](https://docs.ycrc.yale.edu/clusters-at-yale/guides/alphafold/)).
    - **ColabFold** (`colabfold_batch` or the Colab notebook): a **single** sequence entry, chains joined with a **colon** `:`, no trailing colon after the last chain:

        ```text
        >complex
        SEQUENCEA:SEQUENCEA:SEQUENCEB
        ```

        A multi-record FASTA fed to `colabfold_batch` is instead treated as a **batch of independent monomer jobs** — one prediction per record, not one complex — the easiest way to accidentally get several unrelated monomers instead of the complex you meant to predict.

    ??? example "Expert: AlphaFold3 doesn't use FASTA at all"
        AlphaFold3 and the AlphaFold Server take **JSON** input instead — sequences, ligands, ions, and PTMs are all structured fields rather than plain-text records. See [AF2 vs. ColabFold vs. AF3](../fundamentals/af2-vs-colabfold-vs-af3.md) and the official [AlphaFold3 input format docs ↗](https://github.com/google-deepmind/alphafold3/blob/main/docs/input.md) if you're moving a FASTA-based workflow over to AF3.

## What this looks like on a real cluster

!!! info "Beginner"
    Policies vary a lot between sites — module names, GPU generations, schedulers — but the CPU/GPU-split pattern above holds everywhere. Three university clusters, cited here as sources rather than universal specs:

    | Cluster | GPU / CUDA notes | Module example |
    |---|---|---|
    | [University of Chicago RCC ↗](https://docs.rcc.uchicago.edu/software/apps-and-envs/alphafold/) | AF2: V100-class+; AF3: A100-class+, up to 80GB VRAM | `alphafold/2.3.2` |
    | [NSC Berzelius (Sweden) ↗](https://www.nsc.liu.se/support/systems/berzelius-software/berzelius-alphafold/) | Native + Apptainer builds, plus OpenFold as an alternative | `AlphaFold/2.3.2-hpc1` |
    | [Yale YCRC ↗](https://docs.ycrc.yale.edu/clusters-at-yale/guides/alphafold/) | A100/RTX5000/A5000/RTX3090, CUDA 12.1.1 | `AlphaFold/2.3.2-foss-2022b-CUDA-12.1.1` |

    On the compute-capability note above: NVIDIA's V100 (Volta) is compute capability **7.0**, not the ≥8.0 some sites state as a requirement — only Ampere-class (A100) and later genuinely reach 8.0. Don't assume a V100 alone clears an ≥8.0 bar elsewhere.

??? example "Expert: a representative two-stage submission"
    Adapted from the CPU/GPU-split pattern documented by the clusters above — flag names and module strings vary by site, check your own cluster's docs for the exact syntax.

    ```bash
    # Stage 1 — CPU node: MSA/template search only
    module load <alphafold-module>
    bash run_alphafold.sh -d ${ALPHAFOLD_DB} -o ${OUTPUT} \
      -f ${FASTA} -t 2021-11-01 -g false -P 3 -F true

    # Stage 2 — GPU node: inference only (skip search)
    bash run_alphafold.sh -d ${ALPHAFOLD_DB} -o ${OUTPUT} \
      -f ${FASTA} -t 2021-11-01 -g true -P 1 -F false
    ```

    ```bash
    # AlphaFold3, containerized — a common pattern where the system CUDA
    # driver doesn't meet AF3's newer requirement (12.3+, 12.6 preferred)
    module load apptainer
    singularity exec --nv -B "$BIND_PATHS" \
      alphafold3.sif \
      python /app/alphafold/run_alphafold.py \
      --flash_attention_implementation=triton
    ```

    ```bash
    # LocalColabFold — the fast path, same shared database
    colabfold_batch --data ${ALPHAFOLD_DB} input/ output/
    ```

    For throughput, launching several smaller prediction jobs concurrently as background processes (`&` ... `wait`) is a documented pattern when individual jobs don't saturate a GPU alone, rather than one job per GPU allocation.

## Local / lab workflow: GPU-accelerated MSA with apptainer

!!! tip "Advanced"
    If you're running ColabFold on your own apptainer/singularity-based setup rather than a documented HPC module, the same CPU/GPU-split logic applies, and it's worth specifically running the **MSA step on GPU** (via GPU-accelerated MMseqs2) rather than CPU where your hardware allows — this has been benchmarked as dramatically faster than CPU-bound MSA search. See NVIDIA's writeup on [GPU-accelerated MMseqs2 for AlphaFold2](https://developer.nvidia.com/blog/boost-alphafold2-protein-structure-prediction-with-gpu-accelerated-mmseqs2/) and the associated [preprint](https://www.biorxiv.org/content/10.1101/2024.11.13.623350v5) for benchmarks and setup.

    A few practical notes carried over from running ColabFold 1.5.3 via apptainer in production:

    - Expect one apptainer/JAX-related warning about linking modules of different target triples (`nvptx64-nvidia-gpulibs` vs `nvptx64-nvidia-cuda`) — cosmetic, doesn't block a run.
    - JAX may log `Unable to initialize backend 'rocm'`/`'tpu'` — expected and harmless on a CUDA-only node; JAX is just probing for backends that aren't present.
    - Keep a GPU-utilization log (e.g. a background `nvidia-smi` polling loop writing to a `.log` file) alongside your job's stdout/stderr logs — useful after the fact for diagnosing whether a run was actually GPU-bound or stalled elsewhere.
    - `num_recycles` and number of seeds are the main levers for the accuracy/runtime tradeoff: the ColabFold defaults (3 recycles) work for most well-aligned targets; bump both up for very large or difficult targets with shallow MSAs (<200 sequences), understanding this multiplies runtime accordingly. This mirrors the official AF2 v2.3.0 guidance that up to 20 seeds and 20 recycles were used as a CASP15 baseline setting for hard targets, but is not the default due to cost.

## What to check before you interpret the output

!!! info "Beginner"
    Whatever environment you ran on, don't jump straight to the 3D structure. Recommended order: **MSA/sequence coverage plot → pLDDT plot → PAE plot → 3D structure.** See [Reading Confidence Metrics](../interpreting-results/confidence-metrics.md) for what each of these actually tells you, and [Presenting & Sharing Results](best-practices.md) for how to report your run once you trust it.
