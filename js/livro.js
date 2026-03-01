import { transliterarGrego } from './transliterarGrego.js';

const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const setMessage = (text) => {
  const message = document.getElementById("book-message");
  if (!message) return;
  message.textContent = text;
};

const updateDocumentTitle = (livro) => {
  if (!livro?.completo) return;
  document.title = `${livro.completo} \u2014 A Palavra Interlinear`;
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

const renderChapters = (livro) => {
  const title = document.getElementById("book-title");
  const titleOriginal = document.getElementById("book-title-original");
  const grid = document.getElementById("chapters-grid");

  if (title) {
    title.textContent =
      livro?.["titulo traduzido"] || livro?.completo || "Livro";
  }
  if (titleOriginal) {
    const tituloOriginal = livro?.["titulo original"] || "";
    titleOriginal.textContent = tituloOriginal;
    const isGreek = Number.isFinite(livro?.posicao) && livro.posicao >= 40;
    if (tituloOriginal && isGreek) {
      titleOriginal.title = transliterarGrego(tituloOriginal);
    } else {
      titleOriginal.removeAttribute("title");
    }
  }
  updateDocumentTitle(livro);
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  const isPsalms =
    livro?.completo === "Salmos" ||
    livro?.["titulo traduzido"]?.toUpperCase() === "SALMOS";

  for (let i = 1; i <= livro.capitulos; i += 1) {
    const card = document.createElement("div");
    card.className = "chapter-card bg-blue-850";
    card.textContent = i;
    card.title = isPsalms ? `Salmo ${i}` : `Capítulo ${i}`;
    card.setAttribute("role", "button");
    card.tabIndex = 0;

    const goToChapter = () => {
      const livroParam = encodeURIComponent(livro?.posicao ?? "");
      const capitulo = encodeURIComponent(i);
      window.location.href = `capitulo.html?livro=${livroParam}&capitulo=${capitulo}`;
    };

    card.addEventListener("click", goToChapter);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToChapter();
      }
    });
    fragment.appendChild(card);
  }

  grid.innerHTML = "";
  grid.appendChild(fragment);
};

const posicaoParam = getQueryParam("posicao");
const posicao = Number(posicaoParam);

if (!Number.isFinite(posicao)) {
  setMessage("Livro inválido ou parâmetro ausente.");
} else {
  fetch("data-interlinear/livros.json")
    .then((r) => r.json())
    .then((data) => {
      const livros = getAllBooks(data);
      if (livros.length === 0) {
        setMessage("Falha ao carregar a lista de livros.");
        return;
      }

      const livro = livros.find((item) => item.posicao === posicao);
      if (!livro) {
        setMessage("Livro não encontrado.");
        return;
      }

      setMessage("Capítulos");
      renderChapters(livro);
    })
    .catch((err) => {
      console.error("Falha ao carregar livros.json", err);
      setMessage("Falha ao carregar a lista de livros.");
    });
}

