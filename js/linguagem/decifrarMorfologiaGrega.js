const MORFO_MAP = {
  classes: {
    V: "Verbo",
    N: "Substantivo",
    Adv: "Advérbio",
    Adj: "Adjetivo",
    Art: "Artigo",
    DPro: "Pronome Demonstrativo",
    IPro: "Pronome Interrogativo/Indefinido",
    PPro: "Pronome Pessoal/Possessivo",
    RecPro: "Pronome Recíproco",
    RelPro: "Pronome Relativo",
    RefPro: "Pronome Reflexivo",
    Prep: "Preposição",
    Conj: "Conjunção",
    I: "Interjeição",
    Prtcl: "Partícula",
    Heb: "Hebraico",
    Aram: "Aramaico",
  },
  pessoa: { 1: "1ª Pessoa", 2: "2ª Pessoa", 3: "3ª Pessoa" },
  tempo: {
    P: "Presente",
    I: "Imperfeito",
    F: "Futuro",
    A: "Aoristo",
    R: "Perfeito",
    L: "Mais-que-perfeito",
    X: "Tempo desconhecido",
  },
  modo: {
    I: "Indicativo",
    M: "Imperativo",
    S: "Subjuntivo",
    O: "Optativo",
    N: "Infinitivo",
    P: "Particípio",
  },
  voz: { A: "Ativa", M: "Média", P: "Passiva", "M/P": "Média/Passiva" },
  caso: {
    N: "Nominativo",
    V: "Vocativo",
    A: "Acusativo",
    G: "Genitivo",
    D: "Dativo",
  },
  numero: { S: "Singular", P: "Plural" },
  genero: { M: "Masculino", F: "Feminino", N: "Neutro" },
  grau: { C: "Comparativo", S: "Superlativo" },
};

export function decifrarMorfologiaGrega(codigo) {
  if (!codigo) return "";
  const partes = codigo.split("-");
  const classeId = partes[0];
  let res = [MORFO_MAP.classes[classeId] || classeId];

  if (partes.length === 1) return res[0];

  // --- LÓGICA DE VERBOS ---
  if (classeId === "V") {
    const seg = partes[1]; // Ex: "PIA", "PIM/P", "APA"
    const t = MORFO_MAP.tempo[seg[0]] || "";
    const m = MORFO_MAP.modo[seg[1]] || "";
    const v = seg.includes("M/P")
      ? MORFO_MAP.voz["M/P"]
      : MORFO_MAP.voz[seg[2]] || "";

    res.push(`${t} ${m} ${v}`.trim());

    if (partes[2]) {
      const p3 = partes[2];
      // Se o modo for Particípio (P), a 3ª parte é Caso-Gênero-Número (Ex: NMS)
      if (seg[1] === "P") {
        res.push(
          `${MORFO_MAP.caso[p3[0]] || ""} ${MORFO_MAP.genero[p3[1]] || ""} ${
            MORFO_MAP.numero[p3[2]] || ""
          }`.trim()
        );
      } else {
        // Se não for Infinitivo (N), é Pessoa-Número (Ex: 3S)
        if (seg[1] !== "N") {
          res.push(
            `${MORFO_MAP.pessoa[p3[0]] || ""} ${
              MORFO_MAP.numero[p3[1]] || ""
            }`.trim()
          );
        }
      }
    }
  }
  // --- LÓGICA DE NOMINAIS E PRONOMES ---
  else {
    const p1 = partes[1];

    // Regra para Pronomes Pessoais/Reflexivos (PPro, RefPro) que podem ter PESSOA no meio
    if (classeId === "PPro" || classeId === "RefPro") {
      if (p1.length === 4) {
        // Ex: AM3S -> Acusativo Masculino 3ª pessoa Singular
        res.push(
          `${MORFO_MAP.caso[p1[0]]} ${MORFO_MAP.genero[p1[1]]} ${
            MORFO_MAP.pessoa[p1[2]]
          } ${MORFO_MAP.numero[p1[3]]}`
        );
      } else if (p1.length === 3) {
        // Ex: G1P -> Genitivo 1ª pessoa Plural
        res.push(
          `${MORFO_MAP.caso[p1[0]]} ${MORFO_MAP.pessoa[p1[1]]} ${
            MORFO_MAP.numero[p1[2]]
          }`
        );
      } else if (p1.length === 2) {
        // Ex: A2 -> Acusativo 2ª pessoa
        res.push(`${MORFO_MAP.caso[p1[0]]} ${MORFO_MAP.pessoa[p1[1]]}`.trim());
      }
    }
    // Substantivos, Artigos, Adjetivos, Pronomes Rel/Dem/Int (Caso-Gênero-Número)
    else {
      if (p1.length === 3) {
        // Ex: GMS -> Genitivo Masculino Singular
        res.push(
          `${MORFO_MAP.caso[p1[0]] || ""} ${MORFO_MAP.genero[p1[1]] || ""} ${
            MORFO_MAP.numero[p1[2]] || ""
          }`
        );
      }
    }

    // Adiciona Grau (Comparativo/Superlativo) se houver (Ex: Adj-AMS-C)
    if (partes[2] && MORFO_MAP.grau[partes[2]]) {
      res.push(MORFO_MAP.grau[partes[2]]);
    }
  }

  return res.filter((x) => x !== "").join(" - ");
}
