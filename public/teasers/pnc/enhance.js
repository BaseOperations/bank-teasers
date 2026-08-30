// BaseScore Teaser UI Enhancement Script
// Injects scroll animations, micro-interactions, and visual polish
// after the bundler has finished rendering the page content.

(function () {
  "use strict";

  function waitForContent(cb, attempts) {
    if (attempts <= 0) return;
    // The bundler renders into body; look for the main container
    const main = document.querySelector(
      'div[style*="max-width:1080px"], div[style*="max-width: 1080px"]'
    );
    if (main && main.children.length > 2) {
      cb(main);
    } else {
      setTimeout(() => waitForContent(cb, attempts - 1), 200);
    }
  }

  waitForContent(function (main) {
    injectStyles();
    enhanceHeader(main);
    enhanceHowToRead(main);
    enhanceKPICards(main);
    enhanceTierDistribution(main);
    enhanceMap(main);
    enhanceFindings(main);
    enhanceSampleTable(main);
    enhanceCTA(main);
    setupScrollAnimations();
  }, 30);

  // ─── CSS injection ───
  function injectStyles() {
    const css = document.createElement("style");
    css.textContent = `
      /* Scroll reveal base */
      .bo-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s cubic-bezier(0.2,0.7,0.2,1),
                    transform 0.7s cubic-bezier(0.2,0.7,0.2,1);
      }
      .bo-reveal.bo-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .bo-reveal-delay-1 { transition-delay: 0.08s; }
      .bo-reveal-delay-2 { transition-delay: 0.16s; }
      .bo-reveal-delay-3 { transition-delay: 0.24s; }
      .bo-reveal-delay-4 { transition-delay: 0.32s; }
      .bo-reveal-delay-5 { transition-delay: 0.40s; }

      /* Stagger children */
      .bo-stagger > * {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s cubic-bezier(0.2,0.7,0.2,1),
                    transform 0.5s cubic-bezier(0.2,0.7,0.2,1);
      }
      .bo-stagger.bo-visible > * { opacity: 1; transform: translateY(0); }
      .bo-stagger.bo-visible > *:nth-child(1) { transition-delay: 0.05s; }
      .bo-stagger.bo-visible > *:nth-child(2) { transition-delay: 0.10s; }
      .bo-stagger.bo-visible > *:nth-child(3) { transition-delay: 0.12s; }
      .bo-stagger.bo-visible > *:nth-child(4) { transition-delay: 0.18s; }
      .bo-stagger.bo-visible > *:nth-child(5) { transition-delay: 0.22s; }
      .bo-stagger.bo-visible > *:nth-child(6) { transition-delay: 0.26s; }

      /* Tier bar animation */
      .bo-tier-bar > div {
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 1s cubic-bezier(0.2,0.7,0.2,1);
      }
      .bo-tier-bar.bo-visible > div { transform: scaleX(1); }
      .bo-tier-bar.bo-visible > div:nth-child(1) { transition-delay: 0.1s; }
      .bo-tier-bar.bo-visible > div:nth-child(2) { transition-delay: 0.2s; }
      .bo-tier-bar.bo-visible > div:nth-child(3) { transition-delay: 0.3s; }
      .bo-tier-bar.bo-visible > div:nth-child(4) { transition-delay: 0.4s; }

      /* KPI card hover */
      .bo-kpi-card {
        transition: background 0.25s ease, box-shadow 0.25s ease !important;
      }
      .bo-kpi-card:hover {
        background: #252729 !important;
        box-shadow: inset 0 0 0 1px rgba(250,250,250,0.04);
      }

      /* KPI accent strip */
      .bo-kpi-accent {
        position: relative;
      }
      .bo-kpi-accent::before {
        content: '';
        position: absolute;
        left: 0;
        top: 12px;
        bottom: 12px;
        width: 3px;
        border-radius: 2px;
      }

      /* How-to-read cell hover */
      .bo-info-cell {
        transition: background 0.2s ease !important;
        border-left: 2px solid transparent;
        padding-left: 16px !important;
      }
      .bo-info-cell:hover {
        background: rgba(250,250,250,0.02) !important;
      }
      .bo-info-cell:nth-child(1) { border-left-color: #78C6F5; }
      .bo-info-cell:nth-child(2) { border-left-color: #6A93E7; }
      .bo-info-cell:nth-child(3) { border-left-color: #676DD8; }
      .bo-info-cell:nth-child(4) { border-left-color: #9151B9; }

      /* Tier cell dot pulse */
      .bo-tier-dot {
        animation: bo-dot-pulse 2s ease-in-out 1;
      }
      @keyframes bo-dot-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.4); }
      }

      /* Finding card accent */
      .bo-finding-card {
        position: relative;
        transition: background 0.25s ease !important;
      }
      .bo-finding-card:hover {
        background: #252729 !important;
      }
      .bo-finding-active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #9151B9;
      }

      /* Withheld card lock + blur */
      .bo-withheld {
        position: relative;
        transition: transform 0.25s ease !important;
        cursor: default;
      }
      .bo-withheld:hover {
        transform: scale(1.01);
      }
      .bo-withheld::after {
        content: 'Available in full platform';
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #FDD835;
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        white-space: nowrap;
      }
      .bo-withheld:hover::after {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      /* Table row stagger */
      .bo-table-row {
        opacity: 0;
        transform: translateX(-16px);
        transition: opacity 0.4s cubic-bezier(0.2,0.7,0.2,1),
                    transform 0.4s cubic-bezier(0.2,0.7,0.2,1);
      }
      .bo-table-row.bo-visible {
        opacity: 1;
        transform: translateX(0);
      }

      /* Table row hover */
      .bo-table-row-hover {
        transition: background 0.15s ease !important;
      }
      .bo-table-row-hover:hover {
        background: rgba(253,216,53,0.03) !important;
      }

      /* CTA glow */
      .bo-cta-glow {
        box-shadow: 0 0 60px rgba(253,216,53,0.06), inset 0 0 0 1px #FDD835 !important;
        transition: box-shadow 0.4s ease !important;
      }
      .bo-cta-glow:hover {
        box-shadow: 0 0 80px rgba(253,216,53,0.10), inset 0 0 0 1px #FDD835 !important;
      }

      /* CTA button hover */
      .bo-cta-btn {
        transition: transform 0.2s ease, filter 0.2s ease !important;
        display: inline-block !important;
      }
      .bo-cta-btn:hover {
        transform: scale(1.03);
        filter: brightness(1.1);
      }
      .bo-cta-btn:active {
        transform: scale(0.98);
      }

      /* Map perspective entry */
      .bo-map-perspective {
        transform: perspective(1200px) rotateX(4deg);
        transition: transform 1.2s cubic-bezier(0.2,0.7,0.2,1);
      }
      .bo-map-perspective.bo-visible {
        transform: perspective(1200px) rotateX(0deg);
      }

      /* Number count-up holder */
      .bo-countup {
        display: inline-block;
        font-variant-numeric: tabular-nums;
      }

      /* Bullet stagger */
      .bo-bullet-stagger > div {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .bo-bullet-stagger.bo-visible > div:nth-child(1) { transition-delay: 0.05s; }
      .bo-bullet-stagger.bo-visible > div:nth-child(2) { transition-delay: 0.10s; }
      .bo-bullet-stagger.bo-visible > div:nth-child(3) { transition-delay: 0.12s; }
      .bo-bullet-stagger.bo-visible > div:nth-child(4) { transition-delay: 0.18s; }
      .bo-bullet-stagger.bo-visible > div:nth-child(5) { transition-delay: 0.22s; }
      .bo-bullet-stagger.bo-visible > div:nth-child(6) { transition-delay: 0.26s; }
      .bo-bullet-stagger.bo-visible > div {
        opacity: 1;
        transform: translateY(0);
      }

      /* Reduced motion override */
      @media (prefers-reduced-motion: reduce) {
        .bo-reveal, .bo-stagger > *, .bo-tier-bar > div,
        .bo-table-row, .bo-map-perspective, .bo-bullet-stagger > div {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(css);
  }

  // ─── Section enhancers ───

  function enhanceHeader(main) {
    const header = main.querySelector("header");
    if (!header) return;
    header.classList.add("bo-reveal");

    // Make the CTA link a pill button
    const link = header.querySelector('a[href*="meeting"], a[href*="hubspot"]');
    if (link) {
      link.style.cssText +=
        ";display:inline-flex;align-items:center;gap:8px;background:#FDD835;color:#080808;padding:10px 24px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:0;margin-top:8px";
      link.innerHTML =
        link.textContent.trim() +
        ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      link.classList.add("bo-cta-btn");
    }
  }

  function enhanceHowToRead(main) {
    // Second section (bordered top+bottom with "How to read it")
    var sections = main.querySelectorAll("section");
    var howTo = null;
    sections.forEach(function (s) {
      var label = s.querySelector(
        'div[style*="letter-spacing"]'
      );
      if (label && label.textContent.trim().toLowerCase().includes("how to read")) {
        howTo = s;
      }
    });
    if (!howTo) return;

    howTo.classList.add("bo-reveal");
    var grid = howTo.querySelector('div[style*="grid-template-columns"]');
    if (grid) {
      Array.from(grid.children).forEach(function (cell) {
        cell.classList.add("bo-info-cell");
      });
    }
  }

  function enhanceKPICards(main) {
    // Section with 4 KPI cards (grid-template-columns: repeat(4,1fr))
    var sections = main.querySelectorAll("section");
    var kpiSection = null;
    sections.forEach(function (s) {
      if (
        s.getAttribute("style") &&
        s.getAttribute("style").includes("repeat(4")
      ) {
        kpiSection = s;
      }
    });
    if (!kpiSection) return;

    kpiSection.classList.add("bo-reveal", "bo-stagger");
    var cards = kpiSection.children;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      // Skip the 4th (withheld) card
      if (card.style.background === "rgb(14, 15, 18)" || card.style.background === "#0E0F12") {
        continue;
      }
      card.classList.add("bo-kpi-card");

      // Add accent strip to the median card (2nd card with yellow number)
      var yellowNum = card.querySelector('div[style*="FDD835"]');
      if (yellowNum) {
        card.classList.add("bo-kpi-accent");
        card.style.paddingLeft = "28px";
        card.querySelector(".bo-kpi-accent") ||
          (card.style.cssText += ";position:relative");
        var strip = document.createElement("div");
        strip.style.cssText =
          "position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:2px;background:#6A93E7";
        card.appendChild(strip);
      }

      // Count-up animation for big numbers
      var bigNum = card.querySelector(
        'div[style*="font-size:40px"], div[style*="font-size: 40px"]'
      );
      if (bigNum && !bigNum.querySelector('div[style*="FDD835"]')) {
        var text = bigNum.textContent.trim();
        var numMatch = text.match(/^[\d,]+/);
        if (numMatch) {
          setupCountUp(bigNum, numMatch[0]);
        }
      }
    }
  }

  function enhanceTierDistribution(main) {
    var sections = main.querySelectorAll("section");
    var tierSection = null;
    sections.forEach(function (s) {
      var label = s.querySelector('div[style*="letter-spacing"]');
      if (label && label.textContent.trim().toLowerCase().includes("tier distribution")) {
        tierSection = s;
      }
    });
    if (!tierSection) return;

    // Animate the heading area
    var headingArea = tierSection.querySelector('div[style*="flex-direction:column"]');
    if (headingArea) headingArea.classList.add("bo-reveal");

    // Find the colored bar (height:36px)
    var bar = tierSection.querySelector('div[style*="height:36px"]');
    if (bar) {
      bar.classList.add("bo-tier-bar");
      bar.style.borderRadius = "4px";
      bar.style.overflow = "hidden";
    }

    // Tier cells grid
    var tierGrid = tierSection.querySelector(
      'div[style*="repeat(5"]'
    );
    if (tierGrid) {
      tierGrid.classList.add("bo-reveal", "bo-stagger");
      // Add pulse to tier dots
      tierGrid.querySelectorAll('span[style*="border-radius:50%"]').forEach(function (dot) {
        dot.classList.add("bo-tier-dot");
      });
    }
  }

  function enhanceMap(main) {
    var sections = main.querySelectorAll("section");
    var mapSection = null;
    sections.forEach(function (s) {
      var label = s.querySelector('div[style*="letter-spacing"]');
      if (label && label.textContent.trim().toLowerCase().includes("market concentration")) {
        mapSection = s;
      }
    });
    if (!mapSection) return;

    // Heading
    var headDiv = mapSection.querySelector('div[style*="flex-direction:column"]');
    if (headDiv) headDiv.classList.add("bo-reveal");

    // The map component/canvas/svg area
    var mapContainer =
      mapSection.querySelector("x-import") ||
      mapSection.querySelector("canvas") ||
      mapSection.querySelector("svg");
    if (mapContainer) {
      // Wrap in perspective container if not already
      var wrapper = mapContainer.parentElement;
      if (wrapper && !wrapper.classList.contains("bo-map-perspective")) {
        wrapper.classList.add("bo-map-perspective");
      }
    }

    // Legend bar
    var legend = mapSection.querySelector('div[style*="flex-wrap:wrap"][style*="border"]');
    if (legend) {
      legend.classList.add("bo-reveal", "bo-reveal-delay-2");
    }
  }

  function enhanceFindings(main) {
    var sections = main.querySelectorAll("section");
    var findSection = null;
    sections.forEach(function (s) {
      var label = s.querySelector('div[style*="letter-spacing"]');
      if (
        label &&
        label.textContent.trim().toLowerCase().includes("findings")
      ) {
        findSection = s;
      }
    });
    if (!findSection) return;

    var headDiv = findSection.querySelector('div[style*="flex-direction:column"]');
    if (headDiv) headDiv.classList.add("bo-reveal");

    // The 3x2 grid of findings
    var grid = findSection.querySelector('div[style*="repeat(3"]');
    if (!grid) return;

    Array.from(grid.children).forEach(function (card, i) {
      card.classList.add("bo-finding-card", "bo-reveal");
      card.classList.add("bo-reveal-delay-" + Math.min(i + 1, 5));

      var bgStyle = card.style.background || card.style.backgroundColor;
      if (bgStyle === "#0E0F12" || bgStyle === "rgb(14, 15, 18)") {
        // Withheld card
        card.classList.add("bo-withheld");
      } else {
        // Active finding
        card.classList.add("bo-finding-active");
      }
    });
  }

  function enhanceSampleTable(main) {
    var sections = main.querySelectorAll("section");
    var tableSection = null;
    sections.forEach(function (s) {
      var label = s.querySelector('div[style*="letter-spacing"]');
      if (label && label.textContent.trim().toLowerCase().includes("sample rows")) {
        tableSection = s;
      }
    });
    if (!tableSection) return;

    var headDiv = tableSection.querySelector('div[style*="flex-direction:column"]');
    if (headDiv) headDiv.classList.add("bo-reveal");

    // Table rows (grids inside the table container)
    var tableContainer = tableSection.querySelector('div[style*="border:1px"]');
    if (!tableContainer) return;

    var rows = tableContainer.querySelectorAll(
      'div[style*="grid-template-columns"]'
    );
    rows.forEach(function (row, i) {
      if (i === 0) return; // skip header
      row.classList.add("bo-table-row", "bo-table-row-hover");
      row.style.transitionDelay = (i * 0.08) + "s";
    });
  }

  function enhanceCTA(main) {
    // The yellow-bordered CTA section
    var allSections = main.querySelectorAll("section");
    var ctaSection = null;
    allSections.forEach(function (s) {
      if (s.getAttribute("style") && s.getAttribute("style").includes("border:1px solid #FDD835")) {
        ctaSection = s;
      }
    });
    if (!ctaSection) return;

    ctaSection.classList.add("bo-reveal", "bo-cta-glow");

    // Bullet points grid
    var bulletGrid = ctaSection.querySelector('div[style*="grid-template-columns"]');
    if (bulletGrid) {
      bulletGrid.classList.add("bo-bullet-stagger");
    }

    // Book a time button
    var btn = ctaSection.querySelector('a[style*="background:#FDD835"]');
    if (btn) {
      btn.classList.add("bo-cta-btn");
    }
  }

  // ─── Count-up animation ───
  function setupCountUp(el, numStr) {
    var target = parseInt(numStr.replace(/,/g, ""), 10);
    if (isNaN(target)) return;
    var original = el.textContent;
    var suffix = original.replace(numStr, "");

    var observed = false;
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !observed) {
          observed = true;
          animateCount(el, target, suffix);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
  }

  function animateCount(el, target, suffix) {
    var duration = 1200;
    var start = performance.now();

    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var current = Math.round(eased * target);
      el.textContent =
        current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Intersection Observer for scroll reveals ───
  function setupScrollAnimations() {
    var targets = document.querySelectorAll(
      ".bo-reveal, .bo-stagger, .bo-tier-bar, .bo-map-perspective, .bo-bullet-stagger"
    );

    if (!targets.length) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("bo-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "-40px 0px" }
    );

    targets.forEach(function (el) {
      obs.observe(el);
    });

    // Also observe table rows separately
    var tableRows = document.querySelectorAll(".bo-table-row");
    var rowObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("bo-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    tableRows.forEach(function (row) {
      rowObs.observe(row);
    });
  }
})();
