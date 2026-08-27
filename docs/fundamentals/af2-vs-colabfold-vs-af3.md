---
icon: lucide/git-branch
---

# AlphaFold2 vs. ColabFold vs. AlphaFold3

These three names get used loosely and interchangeably, but they answer different questions. AlphaFold2 and AlphaFold3 are **different neural networks** (see [How AlphaFold Works](how-alphafold-works.md) for the architecture differences). ColabFold is **not a different network** — it's a much faster way to run AlphaFold2 (or AlphaFold-Multimer), by replacing the slowest step of the pipeline.

## The short version

!!! info "Beginner"
    | | AlphaFold2 | ColabFold | AlphaFold3 / AlphaFold Server |
    |---|---|---|---|
    | What it is | The original DeepMind network | AF2/AF2-Multimer, run with a much faster homology search | A newer, different network |
    | Molecules | Proteins (+ multimer add-on) | Proteins (+ multimer) | Proteins, DNA, RNA, ligands, ions, PTMs, glycans |
    | Speed | Slow — MSA search dominates runtime | ~20–30x+ faster overall than AF2 | Comparable trunk cost to AF2, plus diffusion sampling |
    | Easiest way to run it | Local install, or DeepMind's official Colab | Local install ("LocalColabFold") or Colab notebook | [AlphaFold Server](https://alphafoldserver.com) web portal, or local install |
    | License | Free, research use | Free, open-source | **Non-commercial only** |

    **Rule of thumb:** for a quick, free protein or protein-complex prediction, start with **ColabFold** (Colab notebook or local). For anything involving DNA/RNA, ligands, ions, or PTMs, you need **AlphaFold3**, most easily via the **AlphaFold Server**. Reach for a **local AlphaFold2 or AlphaFold3 install on HPC** when you need batch throughput, custom databases, or commercial use.

## AlphaFold2 vs. ColabFold: same brain, faster search

!!! tip "Advanced"
    AlphaFold2's biggest bottleneck was never the neural network itself — it was the **MSA search**: querying sequence databases (UniRef90, MGnify, Uniclust30/UniRef30, BFD) using `jackhmmer` and `HHblits`, both CPU-bound and slow. On the original pipeline, this MSA stage consumed roughly **83% of total wall-clock time**.

    **ColabFold** (Steinegger lab) replaces this with **MMseqs2** search against a remote or local server — 40–60x faster homology search — while still using AlphaFold2's (or AlphaFold-Multimer's) original network weights for the actual structure prediction. Net effect: ColabFold matches AF2's accuracy on CASP14 benchmarks (~0.70 ± 0.05 TM-score for both) while being **20–30x faster overall**; a GPU-accelerated MMseqs2 variant pushes this further, to **31.8x faster than plain AF2**, cutting the MSA stage's share of total runtime from 83% down to ~14.7%.

    So: **ColabFold ≈ AlphaFold2's brain + a much faster search step.** It is not a separate, competing architecture.

??? example "Expert: official AF2 Colab vs. ColabFold specifically"
    Even among Colab notebooks, "AlphaFold2 Colab" (DeepMind's official simplified notebook) and "ColabFold" are not the same thing:

    - **Official AlphaFold2 Colab** uses only a portion of BFD and does **not** use homologous structure templates at all — accuracy is described as marginally lower than the full local pipeline.
    - **ColabFold** supports custom MSA input, homologous templates, and exposes tunable parameters (MSA depth, number of recycles) that the official notebook doesn't. This is why it's generally the recommended default over the official notebook.
    - Free-tier Colab practical limits: roughly a **2,500-residue monomer / 4,000-residue multimer** ceiling, with runtime from minutes to hours depending on length and the GPU assigned that session (T4 vs. the faster, paid-tier A100). A ~182-residue protein takes ~10 minutes on a free T4; a 1,442-residue protein takes ~30 minutes on an A100 vs. ~240 minutes on a T4.

## AlphaFold3 & AlphaFold Server: a genuinely different model

!!! info "Beginner"
    AlphaFold3 isn't a faster AlphaFold2 — it's built differently (diffusion-based structure generation instead of AF2's deterministic module; see [How AlphaFold Works](how-alphafold-works.md)), and as a result it can model far more than proteins alone: **DNA, RNA, small-molecule ligands, ions, post-translational modifications, and glycans** — essentially anything you'd find in the PDB except water. It's also strong specifically at **antibody–antigen interactions**, though **RNA structure prediction remains comparatively weaker** than dedicated RNA-specific or expert-curated methods.

    The easiest way to use it is the **[AlphaFold Server](https://alphafoldserver.com)** — a free web portal, no install required, sign in with a Google account.

!!! tip "Advanced: AlphaFold Server practical limits"
    - **5,000-token maximum per job** (1 token = 1 amino acid, 1 nucleotide, or 1 atom of a ligand/ion/modification — large ligands can cost many tokens each).
    - A **daily job quota per user** — this has changed over time and is worth re-checking against the live FAQ at [alphafoldserver.com](https://alphafoldserver.com/guides) before you rely on a specific number.
    - Supported ions are specific and limited: MG, ZN, CL, CA, NA, MN, K, FE, CU, CO.
    - Cannot model water, hydrogens, or membrane planes directly (fatty-acid workarounds exist for membranes); custom user-supplied MSAs/templates are not supported on the Server (only a choice of template cutoff date, or disabling templates).
    - **Output usage restriction**: Server outputs cannot be used in docking/screening tools or to train other ML models — check the Output Terms of Use before building a pipeline around it.

??? example "Expert: licensing — the part people skip"
    AlphaFold3's source is **CC-BY-NC-SA 4.0**, and both the model *parameters* and AlphaFold Server output are restricted to **non-commercial use** — individuals, universities, nonprofits, research institutes, educational/government bodies, or journalism. Commercial use requires contacting Google DeepMind directly. This is a meaningful practical difference from AlphaFold2 and ColabFold, which are free for essentially any use. If your work has any commercial dimension (industry collaboration, a startup, contract research), check the current terms before basing a deliverable on AF3/AlphaFold Server output.

## Multimer support: how we got here

??? example "Expert: AlphaFold-Multimer version history"
    - **AF2 v2.1.0 (Nov 2021)**: introduced multi-chain prediction from multi-sequence FASTA files — "AlphaFold-Multimer" as an add-on to the monomer network.
    - **AF2 v2.2.x**: the `--unicluster30_database_path` flag was renamed to `--uniref30_database_path`, reflecting the Uniclust30 → UniRef30 database rename.
    - **AF2 v2.3.0**: updated Multimer *parameters* (same architecture, new training cutoff of 2021-09-30) — roughly 30% more training data, 4x more cryo-EM structures, 2x more large structures (>2,000 residues); also reduced GPU memory needs for longer proteins.
    - **AlphaFold3**, by contrast, has multimer/multi-molecule support **built into the core architecture from the start** — there's no separate "Multimer mode," since AF3's tokenization and Pairformer/diffusion design natively handle multi-chain, multi-molecule-type inputs.

## Which one should I actually use?

<div class="af-widget" id="af-picker" markdown="0">
  <p class="af-widget-lead">One question at a time instead of scanning the bullet list below:</p>

  <div class="af-widget-step af-widget-step-active" data-step="1">
    <p class="af-widget-progress">Question 1 of 6</p>
    <p class="af-widget-question">Does your target include DNA or RNA — not just protein?</p>
    <button type="button" class="af-widget-btn" data-goto="result-af3">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="2">No</button>
  </div>

  <div class="af-widget-step" data-step="2">
    <p class="af-widget-progress">Question 2 of 6</p>
    <p class="af-widget-question">Do you need a specific ligand or metal ion included in the model?</p>
    <button type="button" class="af-widget-btn" data-goto="result-af3">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="3">No</button>
  </div>

  <div class="af-widget-step" data-step="3">
    <p class="af-widget-progress">Question 3 of 6</p>
    <p class="af-widget-question">Do you need a post-translational modification (phosphorylation, glycosylation, ...) modeled?</p>
    <button type="button" class="af-widget-btn" data-goto="result-af3">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="4">No</button>
  </div>

  <div class="af-widget-step" data-step="4">
    <p class="af-widget-progress">Question 4 of 6</p>
    <p class="af-widget-question">Do you need to run many predictions in batch, rather than one at a time?</p>
    <button type="button" class="af-widget-btn" data-goto="result-hpc">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="5">No</button>
  </div>

  <div class="af-widget-step" data-step="5">
    <p class="af-widget-progress">Question 5 of 6</p>
    <p class="af-widget-question">Do you need custom databases, or commercial-use rights?</p>
    <button type="button" class="af-widget-btn" data-goto="result-hpc">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="6">No</button>
  </div>

  <div class="af-widget-step" data-step="6">
    <p class="af-widget-progress">Question 6 of 6</p>
    <p class="af-widget-question">Is the actual question "is this variant likely pathogenic?" rather than "what's the 3D structure?"</p>
    <button type="button" class="af-widget-btn" data-goto="result-missense">Yes</button>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="result-colabfold">No</button>
  </div>

  <div class="af-widget-step" data-step="result-af3">
    <div class="af-widget-result">
      <p>🧬 <strong>AlphaFold3</strong>, via the <a href="https://alphafoldserver.com">AlphaFold Server</a> for convenience, or a local install for scale/customization.</p>
      <p>Check the non-commercial license first — see <a href="#alphafold3-alphafold-server-a-genuinely-different-model">licensing</a> above.</p>
    </div>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="1">↺ Start over</button>
  </div>

  <div class="af-widget-step" data-step="result-hpc">
    <div class="af-widget-result">
      <p>🖥️ <strong>Local AlphaFold2 (or AlphaFold3, where the license allows) on HPC.</strong></p>
      <p>See <a href="../running-colabfold/hpc-and-local.md">Running ColabFold (local/HPC)</a> for cluster setup.</p>
    </div>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="1">↺ Start over</button>
  </div>

  <div class="af-widget-step" data-step="result-missense">
    <div class="af-widget-result">
      <p>🧪 <strong>Neither AF2 nor AF3 directly — use AlphaMissense</strong>, a separate DeepMind model purpose-built for this question.</p>
      <p>See <a href="../interpreting-results/alphamissense.md">What is AlphaMissense?</a></p>
    </div>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="1">↺ Start over</button>
  </div>

  <div class="af-widget-step" data-step="result-colabfold">
    <div class="af-widget-result">
      <p>⚡ <strong>ColabFold</strong> — the Colab notebook for a one-off, or LocalColabFold for repeated/batch runs.</p>
      <p>The fast, free default for "just give me a protein or complex structure."</p>
    </div>
    <button type="button" class="af-widget-btn af-widget-btn-secondary" data-goto="1">↺ Start over</button>
  </div>
</div>

<script>
(function () {
  function initAfPicker() {
    var root = document.getElementById("af-picker");
    if (!root || root.dataset.afInit === "1") return;
    root.dataset.afInit = "1";

    root.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-goto]");
      if (!btn) return;
      var target = btn.getAttribute("data-goto");
      root.querySelectorAll(".af-widget-step").forEach(function (step) {
        step.classList.toggle("af-widget-step-active", step.getAttribute("data-step") === target);
      });
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initAfPicker);
  } else {
    initAfPicker();
    document.addEventListener("DOMContentLoaded", initAfPicker);
  }
})();
</script>

??? note "Prefer to just read it? Same guide as a static list"
    - **Just want a protein or protein complex structure, fast, for free?** → ColabFold (Colab notebook for one-offs, LocalColabFold for batches/HPC).
    - **Need a ligand, ion, nucleic acid, PTM, or glycan in the model?** → AlphaFold3, via AlphaFold Server for convenience or a local install for scale/customization (check the non-commercial license first).
    - **Running many predictions, need custom databases, or need commercial-use rights?** → Local AlphaFold2 (or AlphaFold3 where license allows) on HPC — see [Running ColabFold (local/HPC)](../running-colabfold/hpc-and-local.md).
    - **Need to interpret a missense variant's likely pathogenicity?** → Neither of the above directly — see [AlphaMissense](../interpreting-results/alphamissense.md), a separate DeepMind model built on top of AlphaFold2.

Continue to [Structure vs. Sequence Homology →](structure-vs-sequence-homology.md)
