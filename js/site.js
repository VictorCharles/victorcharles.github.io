(() => {
  const TOAST_ID = "toast";
  const TOAST_VISIBLE_CLASS = "toast--show";
  const TOAST_DURATION_MS = 2500;
  const COPIED_TEXT = "Copiado!";
  const COPIED_HOLD_MS = 3000;
  const TYPE_SPEED_MS = 35;
  const DELETE_SPEED_MS = 18;

  function setCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = year;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
