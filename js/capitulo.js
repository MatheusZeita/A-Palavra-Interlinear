const NOTES_BREAKPOINT = 800;

const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const getAllBooks = (data) => {
  const crist = Array.isArray(data?.EscriturasCristas)
    ? data.EscriturasCristas
    : [];
  const heb = Array.isArray(data?.EscriturasHebraicas)
    ? data.EscriturasHebraicas
    : [];
  return [...crist, ...heb];
};

const getLayoutElements = () => ({
  wrapper: document.getElementById("wrapper"),
  header: document.getElementById("header"),
  chapterHeader: document.getElementById("chapterHeader"),
  footer: document.getElementById("footer"),
  notesToggle: document.getElementById("notes-toggle"),
  notesToggleButton: document.getElementById("notes-toggle-button"),
  chapterIdentification: document.getElementById("chapterIdentification"),
});

const setChapterLink = (elements, livro, capitulo) => {
  const container = elements.chapterIdentification;
  if (!container) return;

  const link = container.querySelector("a");
  const titleSpan = container.querySelector(".chapter-title");
  if (!link || !titleSpan) return;

  const title = livro?.completo || livro?.curto || "Livro";
  const chapterText = capitulo ? `${title} ${capitulo}` : title;

  link.href = `livro.html?posicao=${encodeURIComponent(livro?.posicao ?? "")}`;
  titleSpan.textContent = chapterText;
};

const updateLayoutVars = (elements) => {
  if (!elements.wrapper) return;

  const headerHeight = elements.header?.offsetHeight ?? 0;
  const chapterHeaderHeight = elements.chapterHeader?.offsetHeight ?? 0;
  const footerHeight = elements.footer?.offsetHeight ?? 0;

  elements.wrapper.style.setProperty("--header-height", `${headerHeight}px`);
  elements.wrapper.style.setProperty(
    "--chapter-header-height",
    `${chapterHeaderHeight}px`
  );
  elements.wrapper.style.setProperty("--footer-height", `${footerHeight}px`);

  let footerOverlap = 0;
  if (elements.footer) {
    const rect = elements.footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    footerOverlap = Math.max(0, viewportHeight - rect.top);
  }
  elements.wrapper.style.setProperty("--footer-overlap", `${footerOverlap}px`);
};

const applyNotesForViewport = (elements) => {
  if (!elements.notesToggle) return;
  const isOpen = window.innerWidth > NOTES_BREAKPOINT;
  elements.notesToggle.checked = isOpen;
  if (elements.notesToggleButton) {
    elements.notesToggleButton.setAttribute("aria-pressed", String(isOpen));
  }
};

const initNotesControls = (elements) => {
  if (!elements.notesToggle || !elements.notesToggleButton) return;

  const syncButtonState = () => {
    elements.notesToggleButton.setAttribute(
      "aria-pressed",
      String(elements.notesToggle.checked)
    );
  };

  elements.notesToggleButton.addEventListener("click", () => {
    elements.notesToggle.checked = !elements.notesToggle.checked;
    syncButtonState();
  });

  elements.notesToggle.addEventListener("change", syncButtonState);
  syncButtonState();
};

const observeLayoutTargets = (elements) => {
  const targets = [elements.header, elements.chapterHeader, elements.footer].filter(
    Boolean
  );
  if (targets.length === 0) return;

  const observer = new MutationObserver(() => {
    updateLayoutVars(elements);
    requestAnimationFrame(() => updateLayoutVars(elements));
  });

  targets.forEach((target) => {
    observer.observe(target, { childList: true, subtree: true });
  });
};

const initLayoutHandlers = (elements) => {
  const handleResize = () => {
    updateLayoutVars(elements);
    applyNotesForViewport(elements);
  };

  window.addEventListener("load", () => {
    updateLayoutVars(elements);
    setTimeout(() => updateLayoutVars(elements), 300);
    applyNotesForViewport(elements);
  });
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", () => updateLayoutVars(elements), {
    passive: true,
  });
  window.addEventListener("DOMContentLoaded", () => observeLayoutTargets(elements));
};

const initChapterPage = () => {
  const elements = getLayoutElements();
  initLayoutHandlers(elements);
  initNotesControls(elements);

  const livroPosicao = Number(getQueryParam("livro"));
  const capituloNumero = Number(getQueryParam("capitulo"));

  if (!Number.isFinite(livroPosicao)) {
    setChapterLink(elements, null, null);
    return;
  }

  fetch("data-interlinear/livros.json")
    .then((r) => r.json())
    .then((data) => {
      const livros = getAllBooks(data);
      const livro = livros.find((item) => item.posicao === livroPosicao);
      if (!livro) {
        setChapterLink(elements, null, capituloNumero);
        return;
      }

      const capitulo = Number.isFinite(capituloNumero)
        ? capituloNumero
        : null;
      setChapterLink(elements, livro, capitulo);
    })
    .catch(() => {
      setChapterLink(elements, null, capituloNumero);
    });
};

initChapterPage();
