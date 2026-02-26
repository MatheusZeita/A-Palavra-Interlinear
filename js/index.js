const CATEGORY_RANGES = [
  { min: 1, max: 4, className: "bg-blue-900" }, // Evangelhos
  { min: 5, max: 5, className: "bg-blue-800" }, // Atos
  { min: 6, max: 19, className: "bg-blue-850" }, // Cartas de Paulo
  { min: 20, max: 26, className: "bg-blue-875" }, // Cartas Gerais
];

const DEFAULT_CATEGORY_CLASS = "bg-blue-900"; // Apocalipse

const getCategoryClass = (ordem) => {
  const match = CATEGORY_RANGES.find(
    (range) => ordem >= range.min && ordem <= range.max
  );
  return match ? match.className : DEFAULT_CATEGORY_CLASS;
};

const createCard = (livro) => {
  const card = document.createElement("div");
  card.className = `scripture-card ${getCategoryClass(livro.ordem)}`;
  card.title = livro.completo;

  const full = document.createElement("span");
  full.className = "label-full";
  full.textContent = livro.completo;

  const medium = document.createElement("span");
  medium.className = "label-medium";
  medium.textContent = livro.medio;

  const short = document.createElement("span");
  short.className = "label-short";
  short.textContent = livro.curto;

  card.append(full, medium, short);
  return card;
};

const renderChristianScriptures = (livros) => {
  const container = document.getElementById("christian-scriptures-catalog");
  if (!container) return;

  const fragment = document.createDocumentFragment();

  livros.forEach((livro) => {
    fragment.appendChild(createCard(livro));
  });

  container.innerHTML = "";
  container.appendChild(fragment);
};

fetch("capitulos/livros.json")
  .then((r) => r.json())
  .then((data) => {
    const livros = data?.EscriturasCristas;
    if (!Array.isArray(livros)) return;

    renderChristianScriptures(livros);
  })
  .catch((err) => {
    console.error("Falha ao carregar livros.json", err);
  });
