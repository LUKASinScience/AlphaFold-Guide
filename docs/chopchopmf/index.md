---
icon: lucide/scissors
---

# ChopChopMF: Overview

[ChopChopMF](https://lukasinscience.github.io/ChopChopMF/) is a **ChimeraX plug-in** that wraps a lot of the manual, error-prone work of analyzing AlphaFold/ColabFold models — cropping, coloring by confidence, mapping AlphaMissense scores, reading PAE plots, running interface analysis, searching for structural homologs — into a point-and-click GUI. It does not replace ChimeraX; it drives it. Every button click is really just a ChimeraX command being run for you.

!!! info "Beginner: why this matters"
    If you already have an AlphaFold or ColabFold model open in ChimeraX, ChopChopMF is usually the fastest way to answer the three questions you'll ask about almost every prediction:

    1. **Which parts of this model can I trust?** → pLDDT coloring, PAE contacts
    2. **Is this residue/domain conserved, and does it carry a known disease-relevant variant?** → Sequence alignment, AlphaMissense fetch/mapping
    3. **What does this structure interact with, and where?** → PDBePISA interface analysis, Foldseek homolog search

This section of the guide is organized by **task**, not by button — see [Workflows & Tips](workflows.md) for step-by-step recipes that combine ChopChopMF tools with the concepts explained earlier in this guide (pLDDT, PAE, AlphaMissense).

## Installation

!!! info "Beginner: requirements"
    ChopChopMF needs **ChimeraX ≥ 1.9** — [download ChimeraX here](https://www.rbvi.ucsf.edu/chimerax/download.html#release) first if you don't have it.

=== "Toolshed (GUI, recommended)"

    1. In ChimeraX, go to **Tools → More Tools** — this opens the Toolshed browser.
    2. Search for **ChopChopMF** and install the latest version.
    3. If it isn't listed directly on the Toolshed start page, just search for it by name.

    No command-line knowledge needed — this is the recommended path for most users.

=== "Toolshed (command line)"

    In the ChimeraX command line:

    ```
    toolshed reload all
    toolshed install ChopChopMF
    ```

    Relaunch ChimeraX after installation.

=== "Manual (.whl file)"

    1. Download the latest ChopChopMF wheel file from the [releases page](https://github.com/LUKASinScience/ChopChopMF/releases).
    2. In ChimeraX, run:
        ```
        toolshed install chimerax_chopchopmf-1.3-py3-none-any.whl
        ```
    3. Relaunch ChimeraX.

Once installed, ChopChopMF adds its own tab inside ChimeraX — no further command-line usage is required afterwards.

## What ChopChopMF can do — at a glance

| Category | Tools | Typical use case |
|---|---|---|
| **Alignment** | Sequence Alignment, Missense Alignment | Conservation coloring; mapping human AlphaMissense scores onto orthologs |
| **Fetch PDB** | AlphaMissense DB fetch, AlphaFold2 fetch/search/predict | Pull structures + per-residue annotation without leaving ChimeraX |
| **Modify Structure** | Crop, Delete Chain, Duplicate, Measure Center, Symmetry Copies | Cleaning up models before downstream analysis (e.g. Foldseek) |
| **Analyze Structure** | PAE Contacts, PAE Interaction Residues, PDBePISA interface scoring, ΔG solvation analysis, Foldseek search | Multimer/complex confidence and interface characterization |
| **Undo** | One-click ChimeraX undo shortcut | Note: does **not** undo Crop or Delete Chain |

!!! warning "Destructive operations"
    **Crop Structure** and **Delete Chain** are terminal — they cannot be undone via ChimeraX's normal undo, and ChopChopMF's own Undo shortcut does not cover them either. Use **Duplicate Structure** first if you want to keep an untouched copy, and use "Hide Deletion Preview" in Crop to check your residue range before committing.

## Supported file formats

| Format | Purpose | Notes |
|---|---|---|
| `.pdb` | Coordinates | Column-based; can struggle with very large structures |
| `.cif` / `.mmCIF` | Coordinates | No atom/chain limits; the default format from AlphaFold/ColabFold |
| `.mrc` / `.map` | Cryo-EM density volumes | Needed for Measure Center / Symmetry Copies |
| `.json` | AlphaFold PAE / confidence metadata | Required alongside the `.cif` for PAE Contacts analysis |
| `.defattr` | Per-residue attribute values | Output of alignment/scoring tools; can be re-applied without recomputation |
| `.xml` | PDBePISA interface data | Exported manually from the [PDBePISA](https://www.ebi.ac.uk/pdbe/pisa/) web server |
| `.tsv` | Custom AlphaMissense scores | For organisms/proteins not in the default AlphaMissense DB pull |

Continue to [Workflows & Tips →](workflows.md)
