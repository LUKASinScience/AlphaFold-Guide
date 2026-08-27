// Open external links in a new tab, so following a source never navigates away from the guide.
(function () {
  function isExternal(a) {
    if (!a.href) return false;
    try {
      var url = new URL(a.href, window.location.href);
      return url.hostname !== window.location.hostname && (url.protocol === "http:" || url.protocol === "https:");
    } catch (e) {
      return false;
    }
  }

  function markExternalLinks() {
    document.querySelectorAll(".md-typeset a, .af-widget a, .af-plugin-card a").forEach(function (a) {
      if (isExternal(a) && !a.hasAttribute("target")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(markExternalLinks);
  } else {
    markExternalLinks();
    document.addEventListener("DOMContentLoaded", markExternalLinks);
  }
})();
