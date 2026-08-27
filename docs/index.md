---
icon: lucide/dna
---

# Lukas AlphaFold Guide

A practical guide to protein structure prediction with AlphaFold2, ColabFold and AlphaFold3 — what they are, how to tell whether a prediction is trustworthy, what AlphaMissense adds on top, and how to do all of this hands-on in ChimeraX with [ChopChopMF](https://lukasinscience.github.io/ChopChopMF/).

!!! warning "Disclaimer"
    This guide was compiled to the best of my knowledge, from the primary documentation and literature linked throughout (see [Resources & Further Reading](resources.md)). It comes with **no guarantee of accuracy or completeness** — tools, thresholds, licenses and web-service limits (AlphaFold Server quotas in particular) change over time, so always cross-check anything decision-critical against the current official source before relying on it.

!!! quote "Found this useful? Cite it"
    If this guide helped your work, citing it helps others find it too:

    ```text
    Bauer, L. W. (2026). Lukas AlphaFold Guide: A practical guide to AlphaFold2,
    ColabFold, AlphaFold3, AlphaMissense and ChopChopMF.
    https://github.com/LUKASinScience
    ```

    Missing something, spotted an error, or have an idea? For the guide itself, corrections and suggestions are welcome — see below once it has a public home. For the tools it covers, report issues or feature ideas directly where they're maintained: [ChopChopMF issues](https://github.com/LUKASinScience/ChopChopMF/issues) · [ChimeraX-FigureStyle issues](https://github.com/LUKASinScience/ChimeraX-FigureStyle/issues).

## Not sure where to start?

<div class="af-widget" id="af-quiz" markdown="0">
  <p class="af-widget-lead">Answer three quick questions and I'll point you to the right page to start on.</p>

  <div class="af-widget-q" data-q="1">
    <p class="af-widget-question">1. Have you run AlphaFold, ColabFold, or the AlphaFold Server before?</p>
    <label><input type="radio" name="af-q1" value="0"> Never</label>
    <label><input type="radio" name="af-q1" value="1"> A few times, mostly with default settings</label>
    <label><input type="radio" name="af-q1" value="2"> Regularly, and I adjust parameters/databases</label>
  </div>

  <div class="af-widget-q" data-q="2">
    <p class="af-widget-question">2. What does pLDDT tell you?</p>
    <label><input type="radio" name="af-q2" value="0"> Not sure yet</label>
    <label><input type="radio" name="af-q2" value="1"> Roughly: how confident the model is, per residue</label>
    <label><input type="radio" name="af-q2" value="2"> I read pLDDT, PAE and ipTM together to judge a whole complex</label>
  </div>

  <div class="af-widget-q" data-q="3">
    <p class="af-widget-question">3. Have you had to judge whether a predicted interface or complex is trustworthy?</p>
    <label><input type="radio" name="af-q3" value="0"> No, not yet</label>
    <label><input type="radio" name="af-q3" value="1"> Once or twice</label>
    <label><input type="radio" name="af-q3" value="2"> Regularly — e.g. for screening or a publication</label>
  </div>

  <button type="button" class="af-widget-btn" id="af-quiz-submit">Show my starting point</button>

  <div class="af-widget-result" id="af-quiz-result" hidden aria-live="polite"></div>
</div>

<script>
(function () {
  function initAfQuiz() {
    var root = document.getElementById("af-quiz");
    if (!root || root.dataset.afInit === "1") return;
    root.dataset.afInit = "1";

    var button = document.getElementById("af-quiz-submit");
    var result = document.getElementById("af-quiz-result");

    button.addEventListener("click", function () {
      var names = ["af-q1", "af-q2", "af-q3"];
      var score = 0;
      var answered = 0;
      names.forEach(function (name) {
        var checked = root.querySelector('input[name="' + name + '"]:checked');
        if (checked) {
          score += parseInt(checked.value, 10);
          answered += 1;
        }
      });

      if (answered < names.length) {
        result.hidden = false;
        result.innerHTML = "<p>Answer all three to get a recommendation — no judgement either way, just so the pointer is useful.</p>";
        return;
      }

      var html;
      if (score <= 2) {
        html = "<p><strong>Start as a beginner.</strong> Read the Beginner boxes on every page, in order:</p>" +
          "<p><a href=\"fundamentals/how-alphafold-works/\">How AlphaFold Works</a> → " +
          "<a href=\"fundamentals/af2-vs-colabfold-vs-af3/\">AF2 vs. ColabFold vs. AF3</a> → " +
          "<a href=\"interpreting-results/confidence-metrics/\">Reading Confidence Metrics</a></p>";
      } else if (score <= 4) {
        html = "<p><strong>You're past the basics — jump into the Advanced boxes.</strong> Good entry points:</p>" +
          "<p><a href=\"interpreting-results/confidence-metrics/\">Reading Confidence Metrics</a> → " +
          "<a href=\"interpreting-results/what-influences-a-prediction/\">What Influences a Prediction</a> → " +
          "<a href=\"chopchopmf/workflows/\">ChopChopMF Workflows</a></p>";
      } else {
        html = "<p><strong>You know the basics — the Expert deep-dives are where this guide has the most to offer you.</strong> Try:</p>" +
          "<p><a href=\"fundamentals/structure-vs-sequence-homology/\">Structure vs. Sequence Homology</a> → " +
          "<a href=\"running-colabfold/best-practices/\">Presenting &amp; Sharing Results</a> → " +
          "<a href=\"resources/\">Resources &amp; Further Reading</a></p>";
      }
      result.hidden = false;
      result.innerHTML = html;
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initAfQuiz);
  } else {
    initAfQuiz();
    document.addEventListener("DOMContentLoaded", initAfQuiz);
  }
})();
</script>

## Who this is for

Every page is written to be read start-to-finish by a beginner, while still holding useful depth for people who already run these tools daily. Content is layered with three consistent markers:

!!! info "Beginner"
    Always visible. The core idea, explained without assuming prior knowledge — read at least this on every page.

!!! tip "Advanced"
    Also always visible, but assumes you've read the beginner section. Practical detail for people already using these tools.

??? example "Expert deep-dive (click to expand)"
    Collapsed by default. Technical/architectural detail, edge cases, and caveats — skip this on a first read, come back when you need it.

## What's in this guide

:lucide-atom: **[Try It: A Real Example Protein](example-protein.md)**
: An interactive 3D viewer on a real AlphaFold DB entry — see pLDDT coloring and PAE on an actual structure, not a diagram.

:lucide-git-branch: **[AF2 vs. ColabFold vs. AF3](fundamentals/af2-vs-colabfold-vs-af3.md)**
: What actually changed between the three, and which one you should reach for.

:lucide-shapes: **[Structure vs. Sequence Homology](fundamentals/structure-vs-sequence-homology.md)**
: Why Foldseek finds relatives BLAST can't — and how to infer function from an unknown fold.

:lucide-gauge: **[Reading Confidence Metrics](interpreting-results/confidence-metrics.md)**
: pLDDT, PAE, pTM/ipTM — what the numbers mean and when to distrust them.

:lucide-sliders-horizontal: **[What Influences a Prediction](interpreting-results/what-influences-a-prediction.md)**
: Why the MSA dominates and a single point mutation usually doesn't.

:lucide-dna: **[AlphaMissense](interpreting-results/alphamissense.md)**
: What it predicts, how it's built, and how *not* to over-interpret a score.

:lucide-monitor: **[Running ColabFold (local/HPC)](running-colabfold/hpc-and-local.md)**
: GPU-accelerated MSA, apptainer, SLURM — and how to present results afterwards.

:lucide-eye: **[Visualization Tools](visualization-tools.md)**
: The landscape (ChimeraX, PyMOL, VMD, Mol*) and why this guide picks ChimeraX.

:lucide-wrench: **[ChopChopMF](chopchopmf/index.md)**
: Turning the concepts above into point-and-click ChimeraX workflows.

:lucide-book-a: **[Glossary](glossary.md)**
: Every acronym used in this guide, one click from wherever you're reading.

!!! note "This guide is local-only for now"
    This is currently a local Zensical build (`zensical serve` / `zensical build`), not yet published anywhere. Structure and content are still evolving — see [Resources & Further Reading](resources.md) for the full list of primary sources this guide is built from.
