---
icon: lucide/workflow
---

# ChopChopMF: Workflows & Tips

Task-based recipes. Each one assumes you already have a structure open in ChimeraX and the ChopChopMF panel visible. Cross-references to the concept pages ([Confidence Metrics](../interpreting-results/confidence-metrics.md), [AlphaMissense](../interpreting-results/alphamissense.md)) explain *why* a step matters, not just *how* to click it.

## 1. First look at a fresh AlphaFold model — pLDDT coloring

!!! info "Beginner"
    1. Open/fetch your structure with **Fetch PDB → AlphaFold2** (by UniProt ID, or via ChimeraX's built-in Fetch/Search/Predict panel that ChopChopMF opens alongside its own).
    2. Select the model in the dropdown and run **pLDDT Coloring**.
    3. Read the color, not just the number: dark orange = low confidence, blue = high confidence. See [Confidence Metrics](../interpreting-results/confidence-metrics.md) for what the pLDDT bands (>90 / 70–90 / 50–70 / <50) actually mean biologically before you interpret orange regions as "wrong."

??? tip "Advanced: per-residue table"
    Run **AlphaSync Residue Analysis** on the same model to get a full per-residue table: pLDDT, SASA, RSA, disorder prediction, secondary structure, and contacts — all in one place, instead of eyeballing colors. Useful when you need to justify a residue selection quantitatively (e.g. "keep only residues with pLDDT > 70 and RSA < 0.25") rather than by color alone.

## 2. Is this variant likely pathogenic? — AlphaMissense mapping

!!! info "Beginner (human protein)"
    1. **Fetch PDB → AlphaMissense DB**, enter the UniProt ID (e.g. `P38398` for BRCA1).
    2. The structure opens and is colored by AlphaMissense score automatically.
    3. Read [What is AlphaMissense](../interpreting-results/alphamissense.md) before treating a "likely pathogenic" color as a clinical conclusion — it isn't one.

??? tip "Advanced (non-human protein)"
    AlphaMissense scores only exist for human proteins. For a mouse/zebrafish/other ortholog, use **Missense Alignment** instead of the direct fetch:

    1. Load your non-human structure.
    2. Select model/chain, enter the **human ortholog's** UniProt ID.
    3. Run the alignment. Matched (conserved) residues get the human AlphaMissense score; unmatched residues are shown in yellow — **not** scored.

??? example "Expert: how much do you trust an extrapolated score?"
    Only conserved residues inherit a score, and single isolated conserved residues surrounded by divergent sequence are a weak basis for extrapolation — a mismatch a few residues away can mean the local structural/chemical environment differs enough that the human pathogenicity score doesn't transfer cleanly. Treat **extended, contiguous conserved stretches** (e.g. a whole conserved domain) as reasonably reliable, and isolated single-residue matches as suggestive at best. This mirrors the general caution in [AlphaMissense](../interpreting-results/alphamissense.md) about not over-reading any single score in isolation.

## 3. Trimming a model before downstream analysis

!!! info "Beginner"
    **Modify Structure → Crop Structure**: select model/chain, enter the residue range(s) to *keep* (e.g. `1-120,150-200`), click **Hide Deletion Preview** first to sanity-check the selection, then execute.

!!! danger "Deletions are terminal"
    Crop and Delete Chain cannot be undone by ChopChopMF's Undo button or ChimeraX's normal undo. If there's any chance you'll want the full model again, run **Duplicate Structure** first (with an XYZ offset so the copy doesn't overlap) and crop the duplicate.

??? tip "Advanced: why crop before a homology/structure search"
    Before a **Foldseek** search (next workflow), crop away flexible termini, linkers, and other clearly disordered regions (check pLDDT / disorder prediction from AlphaSync first — very low, "spaghetti" pLDDT regions are usually intrinsically disordered rather than mispredicted folded domains). Leaving them in dilutes the structural similarity signal Foldseek is matching on and can push real homologs further down the ranked list.

## 4. Finding structural homologs — Foldseek

!!! info "Beginner"
    Foldseek gives you a GUI for structural homolog searches — "closest structural homologs" to your model, without leaving ChimeraX:

    1. **Select the target database**: **PDB** (the default — searches experimental structures) or **AlphaFold DB / afdb50** (searches predicted structures).
    2. **Select the model and chain** to search with (e.g. `1:A`); click **↻ Refresh model list** if your structure isn't listed yet.
    3. Click **ChopChop Foldseek** — ChimeraX runs the structural search and reports the closest structural homologs.

!!! danger "Three caveats that materially change your results"
    The first two are stated directly by the tool's own documentation:

    - *"Foldseek searches will be more precise and efficient if you crop away all unnecessary residues within your structure, so the focus is on your Domain of Interest."* — see [workflow 3](#3-trimming-a-model-before-downstream-analysis) for how to crop.
    - *"Disordered parts of the protein you might also want to delete, since IDPs have no fixed structure and are rather an ensemble of possible structures — Foldseek can't map those on a certain structure well."* Check pLDDT first (workflow 1) to identify which regions are likely disordered before deciding what to crop away.
    - **Don't crop down to a single helix or sheet.** A lone secondary-structure element is a generic building block found in countless unrelated folds — searching with one produces noisy, largely meaningless hits. Crop a *complete* domain (a self-contained fold, typically dozens to a few hundred residues) — small enough to exclude flexible material, large enough to still be a distinctive fold. See [Structure vs. Sequence Homology](../fundamentals/structure-vs-sequence-homology.md) for why this distinction (rigid domain vs. isolated SSE vs. disordered region) matters so much for function inference from a structural hit.

??? tip "Advanced: PDB vs. AlphaFold DB — which to search"
    Searching **PDB** finds experimentally solved homologs — useful when you want a structure with known ligands, crystallographic waters, or functional annotations already attached. Searching **AlphaFold DB (afdb50)** finds predicted homologs across a vastly larger swath of sequence space (including proteins with no solved experimental structure at all) — useful for finding distant relatives in poorly characterized organisms, at the cost of every hit being itself a prediction (check *its* pLDDT before trusting it as a structural reference).

## 5. Reading confidence in a multimer/complex — PAE Contacts

!!! info "Beginner"
    1. Requirement: **only one model** open in ChimeraX for this tool. Open the AlphaFold-predicted complex `.cif` and its matching `.json`.
    2. **Analyze Structure → PAE Contacts**: pick the two chains you care about, set a distance cutoff (5 Å is a reasonable default; avoid going above ~8 Å or you'll pull in noisy, low-confidence pairs).
    3. Run it — pseudobonds are drawn between residue pairs the model is confident are in contact. This is a structural view of the same information a [PAE heatmap](../interpreting-results/confidence-metrics.md) gives you numerically — cross-check the two if the interface matters for your conclusions.

??? tip "Advanced"
    Follow up with **PAE Interaction Residues** (after running PAE Contacts) to auto-select and show the contact residues as sticks — useful for figures or for feeding a residue list into mutagenesis planning.

??? example "Expert: when to reach for the external PAE Viewer instead"
    ChopChopMF's PAE Contacts is fast for a quick "does this interface look real" check inside ChimeraX. For a full 2D PAE heatmap across the *entire* complex (all chain pairs at once, not just two at a time) use the standalone [PAE Viewer](https://pae-viewer.uni-goettingen.de/) alongside it — it's better suited to spotting which *domains* pack confidently against each other in a large multimer, before you drill into specific chain-pair contacts back in ChimeraX.

## 6. Characterizing a protein-protein interface — PDBePISA + ΔG

!!! info "Beginner: getting the XML file"
    PDBePISA analysis needs an XML file you export yourself, from the PDBePISA website (not ChopChopMF):

    1. **Open [PDBePISA](https://www.ebi.ac.uk/pdbe/pisa/)** and press the **Launch PDBePisa** button.
    2. **Submit your structure**: enter your PDB ID, or upload your `.pdb` file under *Select Coordinate file*, and click **Analyze**.
    3. **Interface List**: click the **Interfaces** button to see the list of identified macromolecular contacts.
    4. **Detail View**: press **Details** for the specific interface you want to analyze.
    5. **Configure Display**: scroll to *Interfacing residues*, set **Display level** to **Residues**.
    6. Press the **XML** button and save the `.xml` file.

!!! tip "Advanced: mapping interfaces in ChopChopMF"
    1. **Select the target model** — the model the XML's residues actually belong to (e.g. *Model 1*); click **↻ Refresh model list** if it isn't listed.
    2. Click **Select PDBePISA XML File** and load it — this alone already selects and colors the interface residues in **darkorange**.
    3. To (re-)apply the full 3-way scoring, click **ChopChop PISA Interfaces** and select the corresponding `_output.defattr` file.
    4. Residues are automatically categorized as:
        - **Buried** — hidden in the interface
        - **Hydrogen Bond** — specific polar interactions
        - **Salt Bridge** — electrostatic interactions between charged side chains

??? example "Expert: ΔG (solvation energy) coloring"
    Same XML, but a separate panel focused on thermodynamics rather than contact geometry:

    1. **Select the target model**, then **Load PDBePISA XML File** to bring in the data.
    2. You can load **more than one XML** and switch between them via the **Active XML file** dropdown.
    3. Toggle **Append Mode** to accumulate/compare residues across all loaded XMLs at once, rather than one interface at a time.
    4. Leave **Neutral band (±ε)** checked (default) to keep near-zero-ΔG residues colored light grey as a visual baseline instead of noise.
    5. Use the slider to set a **ΔG Cutoff** threshold (e.g. `0.50 kcal/mol`); with **Only show residues ≥ cutoff** checked, everything below that is excluded from the view.
    6. Click **ChopChop ΔG Coloring** to apply the energy-based coloring to the structure.
    7. Click **Plot ΔG Values** to open a bar chart, scatter plot, and value list for the same data.

    Residues with ΔG = 0.0 or zero buried surface area are excluded automatically. This workflow is aimed at identifying interface "hotspots" — good candidates for alanine-scanning-style follow-up experiments.

## 7. Symmetric assemblies from a density map

!!! info "Beginner"
    1. **Measure Center** on your map/volume → copy the printed XYZ coordinates from the ChimeraX Log.
    2. **Symmetry Copies**: paste those coordinates, select your structure model, choose the symmetry group (C2, D3, ...), and generate.

## Quick reference: pitfalls

| Symptom | Likely cause | Fix |
|---|---|---|
| Crop/Delete removed too much and can't be undone | No duplicate made first | Always **Duplicate Structure** before a destructive edit if the original might still be needed |
| PAE Contacts tool won't run / gives odd results | More than one model open | Close/hide other models — only one is supported |
| AlphaMissense fetch shows nothing | Protein/organism has no native scores | Use **Missense Alignment** against a human ortholog instead of the direct DB fetch |
| Foldseek hits look noisy or miss the obvious homolog | Flexible/disordered regions still in the model | Crop them out first (see workflow 3), then search (workflow 4) |
| Foldseek finds nothing for a poorly characterized organism | Searched PDB only | Switch the target database to AlphaFold DB (afdb50) |
| ΔG plot dominated by tiny values | Neutral band toggle off | Leave **Neutral band (±ε)** checked to hide near-zero residues |
