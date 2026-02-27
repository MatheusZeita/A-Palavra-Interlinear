const CATEGORY_RANGES = [
  { min: 1, max: 5, className: "bg-blue-900" }, // Lei de Moisés
  { min: 6, max: 17, className: "bg-blue-800" }, // Livros Históricos
  { min: 18, max: 22, className: "bg-blue-850" }, // Livros Poéticos
  { min: 23, max: 39, className: "bg-blue-875" }, // Profetas
  { min: 40, max: 43, className: "bg-blue-900" }, // Evangelhos
  { min: 44, max: 44, className: "bg-blue-800" }, // Atos
  { min: 45, max: 58, className: "bg-blue-850" }, // Cartas de Paulo
  { min: 59, max: 65, className: "bg-blue-875" }, // Cartas Gerais
];

const DEFAULT_CATEGORY_CLASS = "bg-blue-900"; // Apocalipse

const getCategoryClass = (posicao) => {
  const match = CATEGORY_RANGES.find(
    (range) => posicao >= range.min && posicao <= range.max
  );
  return match ? match.className : DEFAULT_CATEGORY_CLASS;
};

const createCard = (livro) => {
  const card = document.createElement("div");
  card.className = `scripture-card ${getCategoryClass(livro.posicao)}`;
  card.title = livro.completo;
  card.setAttribute("role", "button");
  card.tabIndex = 0;

  const goToBook = () => {
    const posicao = encodeURIComponent(livro.posicao);
    window.location.href = `livro.html?posicao=${posicao}`;
  };

  card.addEventListener("click", goToBook);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToBook();
    }
  });

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

const renderScriptures = (livros, containerId) => {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(livros) || livros.length === 0) return;

  const fragment = document.createDocumentFragment();

  livros.forEach((livro) => {
    fragment.appendChild(createCard(livro));
  });

  container.innerHTML = "";
  container.appendChild(fragment);
};

fetch("data-interlinear/livros.json")
  .then((r) => r.json())
  .then((data) => {
    const crist = data?.EscriturasCristas;
    const heb = data?.EscriturasHebraicas;

    renderScriptures(crist, "christian-scriptures-catalog");
    renderScriptures(heb, "hebrew-scriptures-catalog");
  })
  .catch((err) => {
    console.error("Falha ao carregar livros.json", err);
  });

