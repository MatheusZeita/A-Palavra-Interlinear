import { transliterarGrego } from "./linguagem/transliterarGrego.js";
import { transliterarHebraico } from "./linguagem/transliterarHebraico.js";
import { decifrarMorfologiaGrega } from "./linguagem/decifrarMorfologiaGrega.js";

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
  aside: document.getElementById("aside"),
});

const buildChapterTitle = (livro, capitulo) => {
  const rawTitle =
    livro?.completo || livro?.["titulo traduzido"] || livro?.curto || "Livro";
  const isPsalms =
    rawTitle === "Salmos" ||
    String(livro?.["titulo traduzido"] || "").toUpperCase() === "SALMOS";
  const title = isPsalms ? "Salmo" : rawTitle;

  if (Number.isFinite(capitulo)) {
    return rawTitle === "Livro" ? `Capítulo ${capitulo}` : `${title} ${capitulo}`;
  }

  return rawTitle === "Livro" ? "Capítulo" : title;
};

const setChapterLink = (elements, livro, capitulo) => {
  const container = elements.chapterIdentification;
  if (!container) return;

  const link = container.querySelector("a");
  const titleSpan = container.querySelector(".chapter-title");
  if (!link || !titleSpan) return;

  const chapterText = buildChapterTitle(livro, capitulo);

  if (Number.isFinite(livro?.posicao)) {
    link.href = `livro.html?posicao=${encodeURIComponent(livro.posicao)}`;
  } else {
    link.href = "livro.html";
  }
  titleSpan.textContent = chapterText;
  document.title = `${chapterText} — A Palavra Interlinear`;
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
    const isHebrew = Number.isFinite(livro?.posicao) && livro.posicao < 40;
    if (tituloOriginal && isGreek) {
      elements.bookTitleOriginal.title = transliterarGrego(tituloOriginal);
    } else if (tituloOriginal && isHebrew && livro?.transliteracao) {
      elements.bookTitleOriginal.title = livro.transliteracao;
    } else {
      elements.bookTitleOriginal.removeAttribute("title");
    }
  }
};

const getBookDisplayName = (livro) =>
  livro?.completo || livro?.["titulo traduzido"] || livro?.curto || "Livro";

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

const syncOriginalFont = (elements) => {
  if (!elements.wrapper || !elements.interlinear) return;
  const sample = elements.interlinear.querySelector(".original");
  if (!sample) return;
  const family = window.getComputedStyle(sample).fontFamily;
  if (family) {
    elements.wrapper.style.setProperty("--original-font", family);
  }
};

const applyNotesForViewport = (elements) => {
  if (!elements.notesToggle) return;
  const isOpen = window.innerWidth > NOTES_BREAKPOINT;
  elements.notesToggle.checked = isOpen;
  if (elements.notesToggleButton) {
    elements.notesToggleButton.setAttribute("aria-pressed", String(isOpen));
  }
};

const openNotesPanel = (elements) => {
  if (!elements.notesToggle) return;
  elements.notesToggle.checked = true;
  if (elements.notesToggleButton) {
    elements.notesToggleButton.setAttribute("aria-pressed", "true");
  }
};

const closeNotesPanel = (elements) => {
  if (!elements.notesToggle) return;
  elements.notesToggle.checked = false;
  if (elements.notesToggleButton) {
    elements.notesToggleButton.setAttribute("aria-pressed", "false");
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

const getStrongBaseUrl = (idiomaNormalizado) => {
  switch (idiomaNormalizado) {
    case "hebraico":
    case "aramaico":
      return "https://biblehub.com/hebrew/";
    case "grego":
    default:
      return "https://biblehub.com/greek/";
  }
};

const getNoteAnchorId = (noteId) => `note-${noteId}`;
const getWordAnchorId = (noteId) => `word-${noteId}`;

const scrollToElement = (element) => {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "center" });
};

const createToken = (
  original,
  traducao,
  traducao2,
  strongId,
  morfologia,
  idioma,
  noteId,
  onNoteClick
) => {
  const idiomaNormalizado = String(idioma || "").toLowerCase();
  const token = document.createElement("span");
  token.className = "token inline-flex flex-col items-center";

  if (strongId) {
    const strongIdAnchor = document.createElement("a");
    strongIdAnchor.className =
      "strongId text-[0.7rem] text-sky-600 hover:text-sky-400";
    strongIdAnchor.textContent = strongId;
    strongIdAnchor.href = `${getStrongBaseUrl(
      idiomaNormalizado
    )}${strongId}.htm`;
    if (idiomaNormalizado === "hebraico") {
      strongIdAnchor.setAttribute("dir", "ltr");
    }
    strongIdAnchor.target = "_blank";
    strongIdAnchor.rel = "noopener noreferrer";
    token.appendChild(strongIdAnchor);
  }

  if (original) {
    const originalSpan = document.createElement("span");
    originalSpan.className = "original text-[1.3rem] text-slate-600";
    originalSpan.textContent = original;

    const titlePorIdioma = {
      grego: () => (originalSpan.title = transliterarGrego(original)),
      hebraico: () => originalSpan.removeAttribute("title"), //(originalSpan.title = transliterarHebraico(original)),
      aramaico: () => originalSpan.removeAttribute("title"), //(originalSpan.title = transliterarAramaico(original)),
    };
    titlePorIdioma[idiomaNormalizado]?.() ||
      originalSpan.removeAttribute("title");

    token.appendChild(originalSpan);
  }

  const addNoteMarker = (target) => {
    if (!noteId || !target) return;
    const marker = document.createElement("a");
    marker.className = "note-marker";
    marker.textContent = "*";
    marker.href = `#${getNoteAnchorId(noteId)}`;
    marker.setAttribute("aria-label", "Ir para nota");
    marker.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof onNoteClick === "function") {
        onNoteClick(noteId);
      }
    });
    target.classList.add("has-note");
    target.appendChild(marker);
  };

  if (traducao) {
    const translation = document.createElement("span");
    translation.className = "traducao text-[1.3rem] text-slate-900";
    translation.textContent = traducao;
    if (traducao2) {
      translation.title = traducao2;
    }
    addNoteMarker(translation);
    token.appendChild(translation);
  } else if (original) {
    const lastChild = token.lastElementChild;
    if (lastChild) addNoteMarker(lastChild);
  }

  if (morfologia && String(idioma || "").toLowerCase() === "grego") {
    const morfologiaAnchor = document.createElement("a");
    morfologiaAnchor.className =
      "morfologia text-[0.7rem] text-cyan-700 hover:text-cyan-500";
    morfologiaAnchor.textContent = morfologia;
    const morfologiaDecifrada = decifrarMorfologiaGrega(morfologia);
    if (morfologiaDecifrada) {
      morfologiaAnchor.title = morfologiaDecifrada;
    }
    morfologiaAnchor.href = "morfologia.html";
    morfologiaAnchor.target = "_blank";
    morfologiaAnchor.rel = "noopener noreferrer";
    token.appendChild(morfologiaAnchor);
  }

  if (noteId) {
    token.id = getWordAnchorId(noteId);
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

const renderWords = (container, words, idioma, options = {}) => {
  if (!Array.isArray(words)) return;
  const {
    insertChapterNumber,
    chapterNumber,
    insertVerseNumber,
    verseNumber,
    onNoteClick,
  } = options;
  let chapterNumberInserted = !insertChapterNumber;
  let verseNumberInserted = !insertVerseNumber;

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

    if (!verseNumberInserted && Number.isFinite(verseNumber) && verseNumber !== 1) {
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
        createToken(
          word.original,
          word.traducao,
          word.traducao2,
          word.strongId,
          word.morfologia,
          idioma,
          word.notaId,
          onNoteClick
        )
      );
    }

    if (word?.fimParagrafo) {
      container.appendChild(createParagraphBreak());
    }
  });
};

const renderInterlinear = (elements, data, capituloNumero) => {
  const container = elements.interlinear;
  if (!container) return;

  container.innerHTML = "";

  const versiculos = Array.isArray(data?.versiculos) ? data.versiculos : [];
  const introducao = data?.introducao?.palavras || [];
  const chapterNumber = Number.isFinite(capituloNumero)
    ? capituloNumero
    : Number(data?.capitulo);
  let chapterNumberToInsert = chapterNumber;

  if (introducao.length > 0) {
    renderWords(container, introducao, data?.idioma, {
      insertChapterNumber: false,
      insertVerseNumber: false,
      onNoteClick: (noteId) => {
        openNotesPanel(elements);
        const noteElement = document.getElementById(getNoteAnchorId(noteId));
        requestAnimationFrame(() => scrollToElement(noteElement));
      },
    });
    if (!introducao.some((word) => word?.fimParagrafo)) {
      container.appendChild(createParagraphBreak());
    }
  }

  versiculos.forEach((versiculo) => {
    const words = Array.isArray(versiculo?.palavras) ? versiculo.palavras : [];
    const verseNumber = Number(versiculo?.numero);
    renderWords(container, words, data?.idioma, {
      insertChapterNumber: true,
      chapterNumber: chapterNumberToInsert,
      insertVerseNumber: true,
      verseNumber,
      onNoteClick: (noteId) => {
        openNotesPanel(elements);
        const noteElement = document.getElementById(getNoteAnchorId(noteId));
        requestAnimationFrame(() => scrollToElement(noteElement));
      },
    });
    // Only insert the chapter number once, on the first verse render.
    chapterNumberToInsert = NaN;
  });

  syncOriginalFont(elements);
};

const renderNotes = (elements, data, livro, capituloNumero) => {
  const aside = elements.aside;
  if (!aside) return;

  aside.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "notes-panel";

  const title = document.createElement("h2");
  title.className = "notes-title";
  title.textContent = "Notas";
  panel.appendChild(title);

  const notes = Array.isArray(data?.notas) ? data.notas : [];
  if (notes.length === 0) {
    aside.appendChild(panel);
    return;
  }

  const notesByVerse = new Map();
  notes.forEach((note) => {
    const verse = Number(note?.versiculo);
    if (!Number.isFinite(verse) || !note?.id) return;
    if (!notesByVerse.has(verse)) notesByVerse.set(verse, []);
    notesByVerse.get(verse).push(note);
  });

  const bookName = getBookDisplayName(livro);
  const chapterNumber = Number.isFinite(capituloNumero)
    ? capituloNumero
    : Number(data?.capitulo);

  const verseNumbers = Array.from(notesByVerse.keys()).sort((a, b) => a - b);
  verseNumbers.forEach((verse) => {
    const subtitle = document.createElement("h3");
    subtitle.className = "notes-subtitle";
    subtitle.textContent = `${bookName} ${chapterNumber}:${verse}`;
    panel.appendChild(subtitle);

    notesByVerse.get(verse).forEach((note) => {
      const noteRow = document.createElement("div");
      noteRow.className = "note-item";
      noteRow.id = getNoteAnchorId(note.id);

      const backLink = document.createElement("a");
      backLink.className = "note-back";
      backLink.textContent = "*";
      backLink.href = `#${getWordAnchorId(note.id)}`;
      backLink.setAttribute("aria-label", "Voltar para palavra");
      backLink.addEventListener("click", (event) => {
        event.preventDefault();
        const wordElement = document.getElementById(getWordAnchorId(note.id));
        scrollToElement(wordElement);
        if (window.innerWidth <= NOTES_BREAKPOINT) {
          closeNotesPanel(elements);
        }
      });

      const bold = document.createElement("strong");
      bold.className = "note-bold";
      bold.textContent = note?.negrito || "";

      const text = document.createElement("span");
      text.className = "note-text";
      text.textContent = note?.texto || "";

      noteRow.appendChild(backLink);
      if (bold.textContent) {
        noteRow.appendChild(bold);
        noteRow.appendChild(document.createTextNode(": "));
      }
      noteRow.appendChild(text);
      panel.appendChild(noteRow);
    });
  });

  aside.appendChild(panel);
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
  const path = `../data-interlinear/${livroPosicao}/${chapterFile}.json`;
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

  fetch("../data-interlinear/livros.json")
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
          renderNotes(elements, chapterData, livro, capituloNumero);
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
