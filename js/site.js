(() => {
  const TOAST_ID = "toast";
  const TOAST_VISIBLE_CLASS = "toast--show";
  const TOAST_DURATION_MS = 2500;
  const COPIED_TEXT = "Copiado!";
  const COPIED_HOLD_MS = 3000;
  const TYPE_SPEED_MS = 35;
  const DELETE_SPEED_MS = 18;
  const PORTFOLIO_DATA_URLS = {
    hero: "data/hero.json",
    featured: "data/featured-projects.json",
    archive: "data/archive-projects.json",
  };
  const HOME_SELECTORS = {
    eyebrow: "[data-home-eyebrow]",
    name: "[data-home-name]",
    summary: "[data-home-summary]",
    proofList: "[data-home-proof]",
    terminal: "[data-home-terminal]",
    actions: "[data-home-actions]",
    focusTitle: "[data-home-focus-title]",
    focusList: "[data-home-focus-list]",
    resolveTitle: "[data-home-resolve-title]",
    resolveList: "[data-home-resolve-list]",
    metricsTitle: "[data-home-metrics-title]",
    metricsList: "[data-home-metrics-list]",
    aboutTitle: "[data-home-about-title]",
    aboutText: "[data-home-about-text]",
    developTitle: "[data-home-develop-title]",
    developList: "[data-home-develop-list]",
  };
  const PORTFOLIO_SELECTORS = {
    heroEyebrow: "[data-portfolio-hero-eyebrow]",
    heroTitle: "[data-portfolio-hero-title]",
    heroSubtitle: "[data-portfolio-hero-subtitle]",
    focusTitle: "[data-portfolio-focus-title]",
    focusList: "[data-portfolio-focus-list]",
    featuredEyebrow: "[data-portfolio-featured-eyebrow]",
    featuredTitle: "[data-portfolio-featured-title]",
    featuredSubtitle: "[data-portfolio-featured-subtitle]",
    featuredList: "[data-portfolio-featured-list]",
    archiveEyebrow: "[data-portfolio-archive-eyebrow]",
    archiveTitle: "[data-portfolio-archive-title]",
    archiveSubtitle: "[data-portfolio-archive-subtitle]",
    archiveList: "[data-portfolio-archive-list]",
  };

  function setCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = year;
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      switch (character) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return character;
      }
    });
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value || "";
  }

  function renderPills(items) {
    return (items || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  function renderListItems(items) {
    return (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function renderMetricCards(metrics) {
    return (metrics || [])
      .map(
        (metric) => `
          <li class="metric-card">
            <strong>${escapeHtml(metric.value || "")}</strong>
            <span>${escapeHtml(metric.label || "")}</span>
          </li>
        `,
      )
      .join("");
  }

  function renderCtas(ctas) {
    return (ctas || [])
      .map((cta, index) => {
        const label = escapeHtml(cta.label || "");
        const href = cta.href || "#";
        const isPrimary = index === 0;
        const variantClass = isPrimary ? "" : " button--ghost";
        const target = cta.target ? ` target="${escapeHtml(cta.target)}"` : "";
        const rel = cta.target === "_blank" ? ' rel="noopener noreferrer"' : "";

        return `<a class="button${variantClass}" href="${escapeHtml(href)}"${target}${rel}>${label}</a>`;
      })
      .join("");
  }

  function renderLinks(links) {
    return (links || [])
      .map((link) => {
        const label = escapeHtml(link.label || "");
        if (link.disabled || !link.href) {
          return `<a class="button button--disabled" href="#" aria-disabled="true">${label}</a>`;
        }

        const variantClass = link.ghost ? " button--ghost" : "";
        const target = link.target
          ? ` target="${escapeHtml(link.target)}"`
          : "";
        const rel =
          link.target === "_blank" ? ' rel="noopener noreferrer"' : "";

        return `<a class="button${variantClass}" href="${escapeHtml(link.href)}"${target}${rel}>${label}</a>`;
      })
      .join("");
  }

  function renderDetails(details) {
    return (details || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  }

  function renderBadge(status) {
    const normalizedStatus = status === "public" ? "public" : "private";
    const label = normalizedStatus === "public" ? "Público" : "Privado";
    return `<span class="badge badge--${normalizedStatus}">${label}</span>`;
  }

  function renderProjectCard(project, headingLevel) {
    const tagName = headingLevel || "h3";
    const eyebrow = project.ey
      ? `<p class="post-card__eyebrow">${escapeHtml(project.ey)}</p>`
      : "";
    const title = escapeHtml(project.title || "");
    const summary = escapeHtml(project.summary || "");
    const details = renderDetails(project.details);
    const tags = renderPills(project.tags);
    const links = renderLinks(project.links);

    return `
      <li class="post-card${project.featured ? " post-card--featured" : ""}">
        <article class="post-card__content">
          <header class="post-card__header">
            <div class="post-card__title-group">
              ${eyebrow}
              <div class="post-card__title-row">
                <${tagName} class="post-card__title">${title}</${tagName}>
                ${renderBadge(project.status)}
              </div>
            </div>
          </header>
          <p class="post-card__excerpt">${summary}</p>
          <ul class="post-card__details">${details}</ul>
          <div class="post-tags" aria-label="Tecnologias">${tags}</div>
          <div class="post-card__actions" aria-label="Links do projeto">${links}</div>
        </article>
      </li>
    `;
  }

  function renderYearGroup(yearGroup) {
    const year = escapeHtml(yearGroup.year || "");
    const id = `portfolio-year-${escapeHtml(yearGroup.year || "unknown")}`;
    const items = (yearGroup.items || [])
      .map((project) => renderProjectCard(project, "h4"))
      .join("");

    return `
      <h3 class="post-list__title" id="${id}">${year}</h3>
      <ul class="post-list">${items}</ul>
    `;
  }

  function renderHome(hero) {
    setText(HOME_SELECTORS.eyebrow, hero.ey);
    setText(HOME_SELECTORS.name, hero.name);
    setText(HOME_SELECTORS.summary, hero.subtitle);
    setText(HOME_SELECTORS.terminal, hero.terminal);
    setText(HOME_SELECTORS.focusTitle, hero.focusTitle);
    setText(HOME_SELECTORS.resolveTitle, hero.solveTitle);
    setText(HOME_SELECTORS.metricsTitle, hero.metricsTitle);
    setText(HOME_SELECTORS.aboutTitle, hero.aboutTitle);
    setText(HOME_SELECTORS.developTitle, hero.developTitle);

    const actions = document.querySelector(HOME_SELECTORS.actions);
    if (actions) {
      actions.innerHTML = renderCtas(hero.cta);
    }

    const proofList = document.querySelector(HOME_SELECTORS.proofList);
    if (proofList) {
      proofList.innerHTML = renderPills(hero.proof);
    }

    const focusList = document.querySelector(HOME_SELECTORS.focusList);
    if (focusList) {
      focusList.innerHTML = renderPills(hero.focus);
    }

    const resolveList = document.querySelector(HOME_SELECTORS.resolveList);
    if (resolveList) {
      resolveList.innerHTML = renderListItems(hero.solve);
    }

    const metricsList = document.querySelector(HOME_SELECTORS.metricsList);
    if (metricsList) {
      metricsList.innerHTML = renderMetricCards(hero.metrics);
    }

    const aboutText = document.querySelector(HOME_SELECTORS.aboutText);
    if (aboutText) {
      aboutText.textContent = hero.about || "";
    }

    const developList = document.querySelector(HOME_SELECTORS.developList);
    if (developList) {
      developList.innerHTML = renderPills(hero.develop);
    }
  }

  function renderPortfolio(data) {
    setText(PORTFOLIO_SELECTORS.heroEyebrow, data.hero?.ey);
    setText(PORTFOLIO_SELECTORS.heroTitle, data.hero?.title);
    setText(PORTFOLIO_SELECTORS.heroSubtitle, data.hero?.subtitle);
    setText(PORTFOLIO_SELECTORS.focusTitle, data.hero?.focusTitle);

    const focusList = document.querySelector(PORTFOLIO_SELECTORS.focusList);
    if (focusList) {
      focusList.innerHTML = renderPills(data.hero?.focus);
    }

    setText(PORTFOLIO_SELECTORS.featuredEyebrow, data.featured?.ey);
    setText(PORTFOLIO_SELECTORS.featuredTitle, data.featured?.title);
    setText(PORTFOLIO_SELECTORS.featuredSubtitle, data.featured?.subtitle);

    const featuredList = document.querySelector(
      PORTFOLIO_SELECTORS.featuredList,
    );
    if (featuredList) {
      featuredList.innerHTML = (data.featured?.items || [])
        .map((project) =>
          renderProjectCard({ ...project, featured: true }, "h3"),
        )
        .join("");
    }

    setText(PORTFOLIO_SELECTORS.archiveEyebrow, data.archive?.ey);
    setText(PORTFOLIO_SELECTORS.archiveTitle, data.archive?.title);
    setText(PORTFOLIO_SELECTORS.archiveSubtitle, data.archive?.subtitle);

    const archiveList = document.querySelector(PORTFOLIO_SELECTORS.archiveList);
    if (archiveList) {
      archiveList.innerHTML = (data.archive?.years || [])
        .map((yearGroup) => renderYearGroup(yearGroup))
        .join("");
    }
  }

  async function loadJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Falha ao carregar ${url}: ${response.status}`);
    }

    return response.json();
  }

  async function loadSiteData() {
    const [hero, featured, archive] = await Promise.all([
      loadJson(PORTFOLIO_DATA_URLS.hero),
      loadJson(PORTFOLIO_DATA_URLS.featured),
      loadJson(PORTFOLIO_DATA_URLS.archive),
    ]);

    return { hero, featured, archive };
  }

  function showLoadError(error) {
    console.error(error);
    const message =
      "Não foi possível carregar os dados do JSON. Verifique a pasta data.";

    [
      HOME_SELECTORS.summary,
      PORTFOLIO_SELECTORS.featuredList,
      PORTFOLIO_SELECTORS.archiveList,
    ].forEach((selector) => {
      const element = document.querySelector(selector);
      if (!element) return;
      element.textContent = message;
    });
  }

  function getToastElement() {
    return document.getElementById(TOAST_ID);
  }

  function showToast(message) {
    const toast = getToastElement();
    if (!toast) {
      window.alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add(TOAST_VISIBLE_CLASS);

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.remove(TOAST_VISIBLE_CLASS);
    }, TOAST_DURATION_MS);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }

  const animationByElement = new WeakMap();

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function typeText(el, text, speedMs, token) {
    for (let i = 0; i < text.length; i += 1) {
      if (token.cancelled) return;
      el.textContent += text[i];
      await sleep(speedMs);
    }
  }

  async function deleteText(el, speedMs, token) {
    while (el.textContent && el.textContent.length > 0) {
      if (token.cancelled) return;
      el.textContent = el.textContent.slice(0, -1);
      await sleep(speedMs);
    }
  }

  async function animateCopied(el, email) {
    const previous = animationByElement.get(el);
    if (previous) previous.cancelled = true;

    const token = { cancelled: false };
    animationByElement.set(el, token);

    try {
      await deleteText(el, DELETE_SPEED_MS, token);
      if (token.cancelled) return;

      await typeText(el, COPIED_TEXT, TYPE_SPEED_MS, token);
      if (token.cancelled) return;

      await sleep(COPIED_HOLD_MS);
      if (token.cancelled) return;

      await deleteText(el, DELETE_SPEED_MS, token);
      if (token.cancelled) return;

      await typeText(el, email, TYPE_SPEED_MS, token);
    } finally {
      const current = animationByElement.get(el);
      if (current === token) animationByElement.delete(el);
    }
  }

  function setupCopyEmail() {
    async function handleTrigger(triggerEl) {
      const email = triggerEl.getAttribute("data-email") || "";
      if (!email) {
        showToast("Email não encontrado");
        return;
      }

      const ok = await copyToClipboard(email);
      if (!ok) {
        showToast("Não foi possível copiar o email");
        return;
      }

      showToast("Email copiado com sucesso");
      await animateCopied(triggerEl, email);
    }

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest("[data-copy-email]");
      if (!trigger) return;

      event.preventDefault();
      void handleTrigger(trigger);
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest("[data-copy-email]");
      if (!trigger) return;

      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      void handleTrigger(trigger);
    });
  }

  function init() {
    setCurrentYear();
    setupCopyEmail();
    void (async () => {
      try {
        const data = await loadSiteData();
        renderHome(data.hero || {});
        renderPortfolio(data);
      } catch (error) {
        showLoadError(error);
      }
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
