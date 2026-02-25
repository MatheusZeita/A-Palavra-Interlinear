# Especificação do Projeto

Este documento descreve os **requisitos funcionais e não funcionais**, os **critérios de aceitação** e os **objetivos principais** do projeto.

---

## 🎯 Objetivo do Projeto

O projeto visa disponibilizar online uma tradução interlinear da Bíblia, exibindo:

- O texto no idioma original — a saber, grego *koiné*
- Tradução palavra por palavra em português
- Notas explicativas adicionais sobre vocabulário, variações e alternativas

Ele tem fins **educacionais e de estudo bíblico**, com foco em precisão textual, simplicidade de navegação e acessibilidade do conteúdo.

---

## 👤 Público-alvo

- Estudantes das Escrituras
- Pesquisadores dos idiomas bíblicos
- Leitores interessados em análise interlinear
- Estudantes de teologia ou exegese bíblica

---

## 📌 Escopo do Sistema

- Apresentar o texto bíblico interlinear (idioma original + tradução literal).
- Permitir navegação entre livros e capítulos.
- Exibir notas explicativas associadas às palavras e ao texto.
- Funcionar sem back-end, usando arquivos JSON estáticos.
- Ser acessível em navegadores modernos (desktop e mobile).

---

## ✅ Requisitos Funcionais (RF) — _Usando MoSCoW_

| Prioridade | Requisito                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------- |
| **Must**   | RF01 - O sistema **deve** exibir a lista interativa dos livros.                                 |
| **Must**   | RF02 - O sistema **deve** permitir navegação entre capítulos de um livro.                       |
| **Must**   | RF03 - O sistema **deve** renderizar o texto interlinear (idioma original + tradução literal).            |
| **Must**   | RF04 - O sistema **deve** carregar dinamicamente os dados dos capítulos via arquivos JSON.      |
| **Must**   | RF05 - O sistema **deve** exibir notas explicativas relacionadas às palavras.                   |
| **Should** | RF06 - O sistema **deveria** permitir clicar em um asterisco e rolar até a nota correspondente. |
| **Should** | RF07 - O sistema **deveria** manter breadcrumbs de navegação.                                   |
| **Could**  | RF08 - O sistema **poderia** implementar busca por palavras gregas.                             |
| **Could**  | RF09 - O sistema **poderia** permitir alternância entre traduções alternativas.                 |
| **Could**  | RF10 - O sistema **poderia** suportar traduções em múltiplos idiomas no futuro.                 |
| **Won’t**  | RF11 - O sistema **não terá** login de usuário na primeira versão.                              |

---

## 📋 Requisitos Não Funcionais (RNF)

| Prioridade | Requisito                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| **Must**   | RNF01 - O sistema **deve** funcionar offline se os arquivos forem servidos localmente.                |
| **Must**   | RNF02 - O site **deve** ser compatível com os navegadores modernos (Chrome, Firefox, Edge).           |
| **Must**   | RNF03 - O tempo de carregamento da página **deve** ser inferior a 2 segundos para arquivos locais.    |
| **Should** | RNF04 - O código **deveria** seguir boas práticas de acessibilidade (semântica HTML, contraste etc.). |
| **Should** | RNF05 - O layout **deveria** ser responsivo para diferentes tamanhos de tela.                         |
| **Could**  | RNF06 - O site **poderia** usar cache local para melhorar performance.                                |
| **Won’t**  | RNF07 - O sistema **não exigirá** servidor back-end ou banco de dados na versão atual.                |

---

## 📂 Estrutura de Dados (Resumo)

Os dados estão organizados em arquivos `.json` por capítulo. Cada entrada contém:

- Nome do livro
- Número do capítulo
- Indicação do idioma original
- Lista de versículos
  - Versículos compostos por palavras
    - Palavra no idioma original
    - Tradução literal em português
    - Nota explicativa (opcional)

(Ver detalhes em `docs/Arquitetura.md`)

---

## 🧪 Critérios de Aceitação

- A navegação entre livros e capítulos funciona sem erros.
- O texto no idioma original e as traduções são exibidos corretamente.
- As notas explicativas são exibidas ao lado e acessíveis por clique.
- O sistema pode ser aberto e usado localmente sem conexão com servidor externo.
- Não há erros visuais ou funcionais em dispositivos móveis.
- O tempo de carregamento permanece leve (< 2 segundos para capítulos locais).

---

## 🛠 Tecnologias Utilizadas

- **HTML + CSS + JavaScript**
- TailwindCSS (opcional para estilo rápido)
- JSON (para representar o conteúdo)
- Hospedagem estática (ex: GitHub Pages ou Netlify)

---

## 🗺 Roadmap de Funcionalidades Futuras

- [ ] Sistema de busca por palavras gregas
- [ ] Conexão com dicionário Strong
- [ ] Suporte a múltiplos idiomas (internacionalização)
- [ ] Destacar palavras-chave ou expressões idiomáticas
- [ ] Exportar capítulo como PDF ou imagem

---

## 📌 Referências Técnicas

- [The SBL Greek New Testament](https://sblgnt.com)
- [Unicode Greek Characters](https://www.unicode.org/charts/PDF/U0370.pdf)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---
