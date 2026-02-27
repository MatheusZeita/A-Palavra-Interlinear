const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const setChapterLink = (livro, capitulo) => {
  const container = document.getElementById("chapterIdentification");
  if (!container) return;

  const link = container.querySelector("a");
  const titleSpan = container.querySelector(".chapter-title");
  if (!link || !titleSpan) return;

  const title = livro?.completo || livro?.curto || "Livro";
  const chapterText = capitulo ? `${title} ${capitulo}` : title;

  link.href = `livro.html?posicao=${encodeURIComponent(livro?.posicao ?? "")}`;
  titleSpan.textContent = chapterText;
};

const livroParam = getQueryParam("livro");
const capituloParam = getQueryParam("capitulo");
const livroPosicao = Number(livroParam);
const capituloNumero = Number(capituloParam);

if (!Number.isFinite(livroPosicao)) {
  setChapterLink(null, null);
} else {
  fetch("data-interlinear/livros.json")
    .then((r) => r.json())
    .then((data) => {
      const livros = [
        ...(Array.isArray(data?.EscriturasCristas)
          ? data.EscriturasCristas
          : []),
        ...(Array.isArray(data?.EscriturasHebraicas)
          ? data.EscriturasHebraicas
          : []),
      ];

      const livro = livros.find((item) => item.posicao === livroPosicao);
      if (!livro) {
        setChapterLink(null, capituloNumero);
        return;
      }

      const capitulo = Number.isFinite(capituloNumero)
        ? capituloNumero
        : null;
      setChapterLink(livro, capitulo);
    })
    .catch(() => {
      setChapterLink(null, capituloNumero);
    });
}
