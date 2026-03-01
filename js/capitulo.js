import { transliterarGrego } from "./transliterarGrego.js";
import { transliterarHebraico } from "./transliterarHebraico.js";

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
  interlinear: document.getElementById("interlinear"),
  bookTitle: document.getElementById("book-title"),
  bookTitleOriginal: document.getElementById("book-title-original"),
});

const setChapterLink = (elements, livro, capitulo) => {
  const container = elements.chapterIdentification;
  if (!container) return;

  const link = container.querySelector("a");
  const titleSpan = container.querySelector(".chapter-title");
  if (!link || !titleSpan) return;

  const rawTitle = livro?.completo || livro?.curto || "Livro";
  const isPsalms = rawTitle === "Salmos";
  const title = isPsalms ? "Salmo" : rawTitle;
  const chapterText = capitulo ? `${title} ${capitulo}` : title;

  link.href = `livro.html?posicao=${encodeURIComponent(livro?.posicao ?? "")}`;
  titleSpan.textContent = chapterText;
};

const setBookTitles = (elements, livro) => {
  if (elements.bookTitle) {
    elements.bookTitle.textContent =
      livro?.["titulo traduzido"] || livro?.completo || "Livro";
  }
  if (elements.bookTitleOriginal) {
    const tituloOriginal = livro?.["titulo original"] || "";
    elements.bookTitleOriginal.textContent = tituloOriginal;
    const isGreek = Number.isFinite(livro?.posicao) && livro.posicao >= 40;
    if (tituloOriginal && isGreek) {
      elements.bookTitleOriginal.title = transliterarGrego(tituloOriginal);
    } else {
      elements.bookTitleOriginal.removeAttribute("title");
    }
  }
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
  const targets = [
    elements.header,
    elements.chapterHeader,
    elements.footer,
  ].filter(Boolean);
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
  window.addEventListener("DOMContentLoaded", () =>
    observeLayoutTargets(elements)
  );
};

const getChapterFileName = (capitulo) => {
  if (!Number.isFinite(capitulo)) return null;
  const pad = capitulo >= 100 ? 3 : 2;
  return String(capitulo).padStart(pad, "0");
};

const createToken = (traducao, original, idioma, strongId) => {
  const token = document.createElement("span");
  token.className = "token inline-flex flex-col items-center";

  var strongId = 5485;
  if (strongId) {
    const strongIdAnchor = document.createElement("a");
    strongIdAnchor.className =
      "strongId text-[0.7rem] text-sky-600 hover:text-sky-400";
    strongIdAnchor.textContent = strongId;
    strongIdAnchor.href = `https://biblehub.com/greek/${strongId}.htm`;
    strongIdAnchor.target = "_blank";
    strongIdAnchor.rel = "noopener noreferrer";
    token.appendChild(strongIdAnchor);
  }

  if (original) {
    const originalSpan = document.createElement("span");
    originalSpan.className = "original text-[1.3rem] text-slate-600";
    originalSpan.textContent = original;

    const idiomaNormalizado = String(idioma || "").toLowerCase();
    const titlePorIdioma = {
      grego: () => (originalSpan.title = transliterarGrego(original)),
      hebraico: () => (originalSpan.title = transliterarHebraico(original)),
      aramaico: () => originalSpan.removeAttribute("title"), //(originalSpan.title = transliterarAramaico(original)),
    };
    titlePorIdioma[idiomaNormalizado]?.() ||
      originalSpan.removeAttribute("title");

    token.appendChild(originalSpan);
  }

  if (traducao) {
    const translation = document.createElement("span");
    translation.className = "traducao text-[1.3rem] text-slate-900";
    translation.textContent = traducao;
    token.appendChild(translation);
  }

  return token;
};

const createNumberToken = (number, className) => {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = number;
  return span;
};

const createParagraphBreak = () => {
  const fragment = document.createDocumentFragment();

  const paragraphBreak = document.createElement("span");
  paragraphBreak.className = "paragraph-break block w-full h-2";

  const paragraphIndentation = document.createElement("div");
  paragraphIndentation.className = "paragraph-indentation inline-flex w-4";

  fragment.appendChild(paragraphBreak);
  fragment.appendChild(paragraphIndentation);

  return fragment;
};

const renderInterlinear = (elements, data, capituloNumero) => {
  const container = elements.interlinear;
  if (!container) return;

  container.innerHTML = "";

  const versiculos = Array.isArray(data?.versiculos) ? data.versiculos : [];
  const chapterNumber = Number.isFinite(capituloNumero)
    ? capituloNumero
    : Number(data?.capitulo);

  let chapterNumberInserted = false;

  versiculos.forEach((versiculo) => {
    const words = Array.isArray(versiculo?.palavras) ? versiculo.palavras : [];
    const verseNumber = Number(versiculo?.numero);
    let verseNumberInserted = false;

    words.forEach((word) => {
      if (!chapterNumberInserted && Number.isFinite(chapterNumber)) {
        container.appendChild(
          createNumberToken(
            chapterNumber,
            "chapter-number inline-flex text-[3rem] text-blue-900 font-bold leading-none mr-3"
          )
        );
        chapterNumberInserted = true;
      }

      if (
        !verseNumberInserted &&
        Number.isFinite(verseNumber) &&
        verseNumber !== 1
      ) {
        container.appendChild(
          createNumberToken(
            verseNumber,
            "verse-number inline-flex text-[1.3em] text-blue-900 font-semibold leading-none"
          )
        );
        verseNumberInserted = true;
      }

      if (word?.traducao || word?.original) {
        container.appendChild(
          createToken(word.traducao, word.original, data?.idioma)
        );
      }

      if (word?.fimParagrafo) {
        container.appendChild(createParagraphBreak());
      }
    });
  });
};

const applyTextDirection = (elements, idioma) => {
  if (!elements.interlinear) return;

  const isHebrew = String(idioma || "").toLowerCase() === "hebraico";
  elements.interlinear.classList.toggle("is-rtl", isHebrew);
  if (isHebrew) {
    elements.interlinear.setAttribute("dir", "rtl");
    elements.interlinear.setAttribute("lang", "he");
  } else {
    elements.interlinear.removeAttribute("dir");
    elements.interlinear.removeAttribute("lang");
  }
};

const fetchChapterData = (livroPosicao, capituloNumero) => {
  const chapterFile = getChapterFileName(capituloNumero);
  if (!chapterFile || !Number.isFinite(livroPosicao)) {
    return Promise.resolve(null);
  }
  const path = `data-interlinear/${livroPosicao}/${chapterFile}.json`;
  return fetch(path).then((r) => r.json());
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

      const capitulo = Number.isFinite(capituloNumero) ? capituloNumero : null;
      setChapterLink(elements, livro, capitulo);
      setBookTitles(elements, livro);

      if (!Number.isFinite(capituloNumero)) return;
      fetchChapterData(livroPosicao, capituloNumero)
        .then((chapterData) => {
          if (!chapterData) return;
          applyTextDirection(elements, chapterData.idioma);
          renderInterlinear(elements, chapterData, capituloNumero);
        })
        .catch(() => {
          if (elements.interlinear) elements.interlinear.innerHTML = "";
        });
    })
    .catch(() => {
      setChapterLink(elements, null, capituloNumero);
    });
};

initChapterPage();
