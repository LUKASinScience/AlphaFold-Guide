---
icon: lucide/server
---

# Running ColabFold Locally & on HPC

Once you outgrow the free Colab tier (batch jobs, custom databases, commercial use, or just tired of session timeouts), you'll run ColabFold or AlphaFold directly — either on your own workstation or on a shared HPC cluster.

## Do you actually need a cluster?

!!! info "Beginner"
    ColabFold needs a decent GPU and a lot of disk space for its reference databases (the full AlphaFold-style bundle is roughly **2.5 TB**, dominated by the ~2 TB **BFD** database). If you don't have that locally, an HPC cluster or `LocalColabFold` on a lab workstation with a single capable GPU (≥ V100-class, ideally more VRAM for larger complexes) is the practical path. Two real-world examples below (University of Chicago's RCC, Sweden's NSC Berzelius) show what this looks like in practice — the specifics differ per cluster, but the pattern is consistent.

## The pattern: split the slow CPU search from the fast GPU inference

!!! tip "Advanced"
    The historically slow part of an AlphaFold2-style pipeline isn't the neural network — it's the **MSA search** (`jackhmmer` against UniRef90/MGnify, `HHblits` against BFD/UniRef30), which is CPU-bound and can consume roughly **80%+ of total wall-clock time** on the original pipeline. This motivates two related practices seen on real clusters:

    1. **Run the MSA/template search on CPU-only nodes, and inference on GPU nodes separately** — don't tie up an expensive GPU allocation while waiting on CPU-bound sequence search. NSC's Berzelius wrapper script exposes this directly via a `-F true/false` "feature-only" flag: run once with `-F true -g false` to produce features only, then again with `-F false -g true` on a GPU node to run inference from the cached features.
    2. **Or skip the search entirely — use ColabFold/MMseqs2.** This is the same problem ColabFold was built to solve (see [AF2 vs. ColabFold vs. AF3](../fundamentals/af2-vs-colabfold-vs-af3.md)): MMseqs2-based search is dramatically faster, which is why `LocalColabFold` is commonly the pre-installed "fast path" module on HPC systems alongside native AlphaFold.

## Example: University of Chicago RCC (Midway3)

??? example "Expert: RCC specifics"
    - **GPU**: AlphaFold2 wants V100-class or better (compute capability ≥ 8.0); AlphaFold3 wants A100-class or better, potentially needing up to 80GB GPU RAM for large/complex inputs.
    - **CUDA**: AF2 needs CUDA 11.3+; AF3 needs CUDA 12.3+ (12.6 preferred) — since the cluster's system driver only supports 12.2, **AF3 is run containerized via Apptainer** specifically to avoid needing a whole-node CUDA upgrade for one application.
    - **CPU/RAM**: 32GB RAM minimum (64GB recommended for large proteins), 16 CPU cores/task recommended.
    - **Module versions**: `alphafold/2.0.0` (default), `2.2.0`, `2.3.2`, with matching versioned database directories; AF3 lives at `/software/alphafold3.0-el8-x86_64/` as a container.

    ```bash
    # AlphaFold2
    module load alphafold/2.3.2 cuda/11.3
    python run_alphafold.py \
      --data_dir=/software/alphafold-data-2.3 \
      --model_preset=monomer \
      --use_gpu_relax=true
    ```

    ```bash
    # AlphaFold3 (containerized)
    module load apptainer
    singularity exec --nv \
      -B "$BIND_PATHS" \
      /software/alphafold3.0-el8-x86_64/alphafold3.sif \
      python /app/alphafold/run_alphafold.py \
      --flash_attention_implementation=triton
    ```

    Typical SLURM allocation: `--gres=gpu:2 --constraint=v100` (AF2) or `--constraint=a100` (AF3), `--ntasks-per-node=1 --cpus-per-task=16`, `--time=04:00:00`. AF2 input is FASTA; AF3 input is JSON.

## Example: NSC Berzelius (Sweden)

??? example "Expert: NSC Berzelius specifics"
    - **Modules**: `AlphaFold/2.3.2-hpc1` (native) and `-apptainer-hpc1` (containerized), `LocalColabFold 1.5.5-hpc1`, and `OpenFold 2.1.0-hpc1` as an alternative implementation.
    - **Databases**: shared read-only at `/proj/common-datasets/AlphaFold` — BFD subset alone is **~1.8 TB**. Interestingly, copying the database to local NVMe scratch (15TB/node) showed **no significant runtime improvement on Berzelius specifically**, unlike on their other cluster (Tetralith) — worth benchmarking on your own system rather than assuming local-copy always helps.
    - **Thread allocation** for the three sequential MSA searches (configurable in `pipeline.py`/`pipeline_multimer.py`): `jackhmmer` (UniRef90) 8 threads, `jackhmmer` (MGnify) 8 threads, `HHblits` (BFD) 16 threads, `jackhmmer` (UniProt, multimers only) 32 threads.

    ```bash
    # Stage 1 — CPU node: MSA/template search only
    module load AlphaFold/2.3.2-hpc1
    bash run_alphafold.sh -d ${ALPHAFOLD_DB} -o ${OUTPUT} \
      -f ${FASTA} -t 2021-11-01 -g false -P 3 -F true

    # Stage 2 — GPU node: inference only (skip search)
    bash run_alphafold.sh -d ${ALPHAFOLD_DB} -o ${OUTPUT} \
      -f ${FASTA} -t 2021-11-01 -g true -P 1 -F false
    ```

    ```bash
    # LocalColabFold — the fast path
    colabfold_batch --data /proj/common-datasets/AlphaFold input/ output/
    ```

    For throughput, the guide recommends launching several smaller prediction jobs concurrently as background processes (`&` ... `wait`) rather than one job per GPU allocation, when individual jobs don't saturate the GPU alone.

## Local / lab workflow: GPU-accelerated MSA with apptainer

!!! tip "Advanced"
    If you're running ColabFold on your own apptainer/singularity-based setup rather than a documented HPC module, the same CPU/GPU-split logic applies, and it's worth specifically running the **MSA step on GPU** (via GPU-accelerated MMseqs2) rather than CPU where your hardware allows — this has been benchmarked as dramatically faster than CPU-bound MSA search. See NVIDIA's writeup on [GPU-accelerated MMseqs2 for AlphaFold2](https://developer.nvidia.com/blog/boost-alphafold-protein-structure-prediction-with-gpu-accelerated-mmseqs2/) and the associated [preprint](https://www.biorxiv.org/content/10.1101/2024.11.13.623350v5) for benchmarks and setup.

    A few practical notes carried over from running ColabFold 1.5.3 via apptainer in production:

    - Expect one apptainer/JAX-related warning about linking modules of different target triples (`nvptx64-nvidia-gpulibs` vs `nvptx64-nvidia-cuda`) — cosmetic, doesn't block a run.
    - JAX may log `Unable to initialize backend 'rocm'`/`'tpu'` — expected and harmless on a CUDA-only node; JAX is just probing for backends that aren't present.
    - Keep a GPU-utilization log (e.g. a background `nvidia-smi` polling loop writing to a `.log` file) alongside your job's stdout/stderr logs — useful after the fact for diagnosing whether a run was actually GPU-bound or stalled elsewhere.
    - `num_recycles` and number of seeds are the main levers for the accuracy/runtime tradeoff: the ColabFold defaults (3 recycles) work for most well-aligned targets; bump both up for very large or difficult targets with shallow MSAs (<200 sequences), understanding this multiplies runtime accordingly. This mirrors the official AF2 v2.3.0 guidance that up to 20 seeds and 20 recycles were used as a CASP15 baseline setting for hard targets, but is not the default due to cost.

## What to check before you interpret the output

!!! info "Beginner"
    Whatever environment you ran on, don't jump straight to the 3D structure. Recommended order: **MSA/sequence coverage plot → pLDDT plot → PAE plot → 3D structure.** See [Reading Confidence Metrics](../interpreting-results/confidence-metrics.md) for what each of these actually tells you, and [Presenting & Sharing Results](best-practices.md) for how to report your run once you trust it.
