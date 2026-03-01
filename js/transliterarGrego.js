/**
 * Translitera Grego Koiné para o padrão acadêmico (SBL Academic Style).
 * Trata: Espírito áspero, gamas nasais, ditongos (incluindo υι),
 * diéreses, rho inicial/duplo e capitalização inteligente.
 */
export function transliterarGrego(texto) {
  // 1. Normalização NFD para decomposição de diacríticos
  let t = texto.normalize("NFD");

  // Normaliza apóstrofos de elisão (ex: δι’ -> di’)
  t = t.replace(/[\u2019\u02BC]/g, "'");

  // Função interna para detectar se o contexto da palavra é All-Caps
  const isWordUpperCase = (str, idx) => {
    let fragmento = str.slice(idx).split(/\s/)[0]; // Pega a palavra atual
    let letras = fragmento.match(/[α-ωΑ-Ω]/g) || [];
    if (letras.length <= 1) return letras[0] === letras[0].toUpperCase();
    return letras.every((l) => l === l.toUpperCase());
  };

  // 2. Tratamento de Espírito Áspero (\u0314)
  // A. Em Ditongos (Ex: αὑ -> hau, υἱ -> hui). Ignora se houver diérese (\u0308).
  t = t.replace(
    /([ΑΕΗΟΩΥαεηοωυ])([\u0300-\u036f]*)([ιυ])(?![^\u0300-\u036f]*\u0308)([\u0300-\u036f]*)\u0314/g,
    (m, v1, acc1, v2, acc2, offset) => {
      const h = v1 === v1.toUpperCase() ? "H" : "h";
      const vogal1 =
        v1 === v1.toUpperCase() && !isWordUpperCase(t, offset)
          ? v1.toLowerCase()
          : v1;
      return h + vogal1 + acc1 + v2 + acc2;
    }
  );

  // B. Em Vogais Simples ou Rho inicial (Ex: ἁ -> ha, ῥ -> rh)
  t = t.replace(
    /([ΑΕΗΙΟΥΩΡαεηιουωρ])([\u0300-\u036f]*)\u0314/g,
    (m, v, acc, offset) => {
      const isUpper = v === v.toUpperCase();
      const allCaps = isWordUpperCase(t, offset);
      if (v.toLowerCase() === "ρ")
        return isUpper ? (allCaps ? "RH" : "Rh") : "rh";
      const h = isUpper ? "H" : "h";
      const vogal = isUpper && !allCaps ? v.toLowerCase() : v;
      return h + vogal + acc;
    }
  );

  // 3. Casos Fonéticos Especiais
  // Gama Nasal (γγ -> ng, γκ -> nk...)
  t = t
    .replace(/γ(?=[\u0300-\u036f]*[γκξχ])/g, "n")
    .replace(/Γ(?=[\u0300-\u036f]*[ΓΚΞΧ])/g, "N");

  // Ipsilon como 'u' em ditongos (Exceto se houver diérese)
  t = t
    .replace(/([αεηοωΑΕΗΟΩ])([\u0300-\u036f]*)υ(?!\u0308)/g, "$1$2u")
    .replace(/([αεηοωΑΕΗΟΩ])([\u0300-\u036f]*)Υ(?!\u0308)/g, "$1$2U")
    .replace(/υ([\u0300-\u036f]*)ι(?!\u0308)/g, "u$1i")
    .replace(/Υ([\u0300-\u036f]*)Ι(?!\u0308)/g, "U$1I");

  // Rho Duplo medial (ρρ -> rrh)
  t = t.replace(/ρρ/g, "rrh").replace(/ΡΡ/g, "RRH");

  // 4. Mapeamento de Caracteres SBL
  const mapa = {
    α: "a",
    β: "b",
    γ: "g",
    δ: "d",
    ε: "e",
    ζ: "z",
    η: "ē",
    θ: "th",
    ι: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "x",
    ο: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    ς: "s",
    τ: "t",
    υ: "y",
    φ: "ph",
    χ: "ch",
    ψ: "ps",
    ω: "ō",
    Α: "A",
    Β: "B",
    Γ: "G",
    Δ: "D",
    Ε: "E",
    Z: "Z",
    Η: "Ē",
    Θ: "Th",
    Ι: "I",
    Κ: "K",
    Λ: "L",
    Μ: "M",
    Ν: "N",
    Ξ: "X",
    Ο: "O",
    Π: "P",
    Ρ: "R",
    Σ: "S",
    Τ: "T",
    Υ: "Y",
    Φ: "Ph",
    Χ: "Ch",
    Ψ: "Ps",
    Ω: "Ō",
    "\u0345": "i", // Iota subscrito
    "\u0308": "", // Remove diérese após uso
  };

  let resultado = "";
  for (let i = 0; i < t.length; i++) {
    let char = t[i];
    if (mapa[char] !== undefined) {
      let tr = mapa[char];
      // Ajuste de dígrafos (Th vs TH)
      if (
        tr.length >= 2 &&
        char === char.toUpperCase() &&
        isWordUpperCase(t, i)
      ) {
        tr = tr.toUpperCase();
      }
      resultado += tr;
    } else if (!char.match(/[\u0300-\u036f]/)) {
      resultado += char; // Mantém pontuação, números e espaços
    }
  }

  return resultado.normalize("NFC").replace(/·/g, ";").replace(/;/g, "?");
}
