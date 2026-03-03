// ESTÁ BUGADO, DEVE SER CONCERTADO

/**
 * transliterarHebraico — versão revisada (SBL-like, Tiberian heuristics)
 *
 * Principais melhorias:
 * - corrige regex stateful (remove uso de /.../g para .test loops)
 * - trata mappiq (ה + DAGESH) corretamente (não duplica)
 * - heurística para QAMATS QATAN quando U+05C7 ausente (sílabas fechadas)
 * - tratamento robusto de shewa (na' vs naḥ) com regras práticas
 * - não duplica mappiq; trata geminação apenas quando apropriado
 *
 * Limitações remanescentes (explicadas ao final): precisar de léxico para 100% de certeza em alguns casos.
 */
export function transliterarHebraico(texto) {
  const normalized = texto.normalize("NFD");

  // Regexs
  const CANTILLATION_GLOBAL = /[\u0591-\u05AF]/g; // remover
  const NIQQUD_TEST = /[\u05B0-\u05BC\u05C1\u05C2\u05C7\u05BD]/; // para .test (sem g)
  const NIQQUD_GLOBAL = /[\u05B0-\u05BC\u05C1\u05C2\u05C7\u05BD]/g; // para replace, remove, etc.

  // Remover ta'amim (cantillation)
  let t = normalized.replace(CANTILLATION_GLOBAL, "");

  // Pontos/marcas
  const SHEVA = "\u05B0";
  const HATAF_SEGOL = "\u05B1";
  const HATAF_PATAH = "\u05B2";
  const HATAF_QAMATS = "\u05B3";
  const HIRIQ = "\u05B4";
  const TSERE = "\u05B5";
  const SEGOL = "\u05B6";
  const PATAH = "\u05B7";
  const QAMATS = "\u05B8";
  const HOLAM = "\u05B9";
  const QUBUTS = "\u05BB";
  const DAGESH = "\u05BC";
  const METEG = "\u05BD";
  const SHIN_DOT = "\u05C1";
  const SIN_DOT = "\u05C2";
  const QAMATS_QATAN = "\u05C7";

  const isHebrewLetter = (ch) => /[\u05D0-\u05EA]/.test(ch);

  // Mapas
  const begadkefatPlosive = { ב: "b", ג: "g", ד: "d", כ: "k", פ: "p", ת: "t" };
  const begadkefatFricative = {
    ב: "v",
    ג: "ḡ",
    ד: "ḏ",
    כ: "ḵ",
    פ: "f",
    ת: "ṯ",
  };

  const consonantBase = {
    א: "ʾ",
    ע: "ʿ",
    ה: "h",
    ח: "ḥ",
    ט: "ṭ",
    י: "y",
    ו: "w",
    ז: "z",
    ס: "s",
    ק: "q",
    ר: "r",
    ל: "l",
    מ: "m",
    נ: "n",
    צ: "ṣ",
    ץ: "ṣ",
    כ: "ḵ",
    ך: "ḵ",
    פ: "f",
    ף: "f",
    ג: "ḡ",
    ד: "ḏ",
    ת: "ṯ",
    ש: "š", // default; sin handled by dot
  };

  // Particiona o texto em "tokens" (base + marks) preservando separadores
  const tokens = []; // { base, marks: [], separator }
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (isHebrewLetter(ch)) {
      const marks = [];
      let j = i + 1;
      while (j < t.length && NIQQUD_TEST.test(t[j])) {
        marks.push(t[j]);
        j++;
      }
      tokens.push({ base: ch, marks: marks, separator: false });
      i = j - 1;
    } else {
      tokens.push({ base: ch, marks: [], separator: true });
    }
  }

  // helpers
  const hasMark = (marks, mark) => marks.indexOf(mark) !== -1;

  // shewa vocal heuristics (practical rules)
  function isShewaVocalAt(idx) {
    const node = tokens[idx];
    if (!node || node.separator) return false;
    if (!hasMark(node.marks, SHEVA)) return false;

    // 1) shewa in word-initial position -> vocal
    let wstart = idx;
    while (wstart - 1 >= 0 && !tokens[wstart - 1].separator) wstart--;
    if (idx === wstart) return true;

    // 2) second of two shevas -> vocal
    if (
      idx - 1 >= 0 &&
      !tokens[idx - 1].separator &&
      hasMark(tokens[idx - 1].marks, SHEVA)
    ) {
      return true;
    }

    // 3) dagesh present (often vocal)
    if (hasMark(node.marks, DAGESH)) return true;

    // 4) previous letter has long vowel (tsere, qamats, holam, explicit qamats_qatan)
    const prev = idx - 1;
    if (prev >= 0 && !tokens[prev].separator) {
      const pm = tokens[prev].marks;
      if (
        hasMark(pm, TSERE) ||
        hasMark(pm, QAMATS) ||
        hasMark(pm, QAMATS_QATAN) ||
        hasMark(pm, HOLAM)
      )
        return true;
      if (hasMark(pm, METEG)) return true; // meteg can indicate vocalization
    }

    // Default: silent (naḥ)
    return false;
  }

  // map vowels given marks and shewa decision
  function mapVowel(marks, idx) {
    // chataf priority
    if (hasMark(marks, HATAF_PATAH)) return "ă";
    if (hasMark(marks, HATAF_SEGOL)) return "ĕ";
    if (hasMark(marks, HATAF_QAMATS)) return "ŏ";

    if (hasMark(marks, SHEVA)) return isShewaVocalAt(idx) ? "ĕ" : "";

    if (hasMark(marks, QAMATS_QATAN)) return "o"; // explicit
    if (hasMark(marks, TSERE)) return "ē";
    if (hasMark(marks, SEGOL)) return "e";
    if (hasMark(marks, HIRIQ)) return "i";
    if (hasMark(marks, PATAH)) return "a";
    if (hasMark(marks, QAMATS)) {
      // Heurística: qamats qatan provável se sílaba é fechada (próximo é consoante sem vogal)
      const nextIdx = idx + 1;
      if (nextIdx < tokens.length && !tokens[nextIdx].separator) {
        const nextMarks = tokens[nextIdx].marks;
        const nextHasVowel =
          hasMark(nextMarks, SHEVA) ||
          hasMark(nextMarks, HIRIQ) ||
          hasMark(nextMarks, TSERE) ||
          hasMark(nextMarks, SEGOL) ||
          hasMark(nextMarks, PATAH) ||
          hasMark(nextMarks, QAMATS) ||
          hasMark(nextMarks, HOLAM) ||
          hasMark(nextMarks, QUBUTS) ||
          hasMark(nextMarks, QAMATS_QATAN);
        // se o próximo é consoante sem vogal -> sílaba fechada => tratar como qatan (o)
        if (!nextHasVowel) return "o";
      }
      return "ā"; // padrão: long a
    }
    if (hasMark(marks, HOLAM)) return "ō";
    if (hasMark(marks, QUBUTS)) return "u";

    // sem vogal apontada (mater lectionis) => nada
    return "";
  }

  // construção
  let out = "";
  for (let i = 0; i < tokens.length; i++) {
    const node = tokens[i];
    if (node.separator) {
      out += node.base;
      continue;
    }

    const base = node.base;
    const marks = node.marks;

    // Shin/sin
    if (base === "ש") {
      if (hasMark(marks, SHIN_DOT)) out += "š";
      else if (hasMark(marks, SIN_DOT)) out += "ś";
      else out += "š";
      out += mapVowel(marks, i);
      continue;
    }

    // Begadkefat
    if (Object.prototype.hasOwnProperty.call(begadkefatPlosive, base)) {
      if (hasMark(marks, DAGESH)) {
        // dagesh in begadkefat => plosive (b/g/d/k/p/t)
        out += begadkefatPlosive[base];
      } else {
        out += begadkefatFricative[base] || consonantBase[base] || "";
      }
      out += mapVowel(marks, i);
      continue;
    }

    // Mappiq: ה + DAGESH -> preserve h (do not geminate)
    if (base === "ה" && hasMark(marks, DAGESH)) {
      out += "h";
      out += mapVowel(marks, i);
      continue;
    }

    // Dagesh in other consonants -> gemination (duplicate translit)
    if (hasMark(marks, DAGESH)) {
      const baseTrans = consonantBase[base] || "";
      out += baseTrans + baseTrans;
      out += mapVowel(marks, i);
      continue;
    }

    // Normal consonants
    if (consonantBase[base]) {
      out += consonantBase[base];
      out += mapVowel(marks, i);
      continue;
    }

    // fallback: emit base + vowel mapping
    out += base + mapVowel(marks, i);
  }

  return out.normalize("NFC");
}
