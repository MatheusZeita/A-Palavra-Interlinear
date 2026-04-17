# Especificação do Projeto

Este documento descreve os **requisitos funcionais e não funcionais**, os **critérios de aceitação** e os **objetivos principais** do projeto.

---

## 🎯 Objetivo do Projeto

O projeto visa disponibilizar online uma tradução interlinear da Bíblia, exibindo:

- O texto no idioma original
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
- Ser acessível em navegadores modernos, em desktop e mobile.

---

## ✅ Estado Atual Implementado

No estado atual do projeto, o sistema já implementa:

- Catálogo interativo de livros a partir de `data/interlinear/livros.json`.
- Navegação por livro via `pages/livro.html?posicao=<numero>`.
- Navegação por capítulo via `pages/capitulo.html?livro=<numero>&capitulo=<numero>`.
- Renderização interlinear por palavra a partir de JSON estático.
- Painel lateral de notas com navegação entre palavra e nota.
- Links externos de Strong quando `strongId` está presente.
- Decifração de morfologia grega quando `morfologia` está presente.
- Direção RTL para capítulos em hebraico.

Itens ainda não consolidados como parte da implementação atual:

- Breadcrumbs visuais.
- Busca por palavras.
- Alternância de traduções alternativas na interface.

---

## ✅ Requisitos Funcionais (RF) — Usando MoSCoW

| Prioridade | Requisito |
| ---------- | --------- |
| **Must** | RF01 - O sistema **deve** exibir a lista interativa dos livros. |
| **Must** | RF02 - O sistema **deve** permitir navegação entre capítulos de um livro. |
| **Must** | RF03 - O sistema **deve** renderizar o texto interlinear (idioma original + tradução literal). |
| **Must** | RF04 - O sistema **deve** carregar dinamicamente os dados dos capítulos via arquivos JSON. |
| **Must** | RF05 - O sistema **deve** exibir notas explicativas relacionadas às palavras. |
| **Must** | RF06 - O sistema **deve** suportar Strong quando `strongId` estiver presente nos dados. |
| **Must** | RF07 - O sistema **deve** exibir morfologia grega quando `morfologia` estiver presente nos dados. |
| **Must** | RF08 - O sistema **deve** aplicar RTL em capítulos hebraicos. |
| **Should** | RF09 - O sistema **deveria** permitir clicar em um asterisco e rolar até a nota correspondente. |
| **Should** | RF10 - O sistema **deveria** manter breadcrumbs de navegação. |
| **Could** | RF11 - O sistema **poderia** implementar busca por palavras gregas. |
| **Could** | RF12 - O sistema **poderia** permitir alternância entre traduções alternativas. |
| **Could** | RF13 - O sistema **poderia** suportar traduções em múltiplos idiomas no futuro. |
| **Won’t** | RF14 - O sistema **não terá** login de usuário na primeira versão. |

---

## 📋 Requisitos Não Funcionais (RNF)

| Prioridade | Requisito |
| ---------- | --------- |
| **Must** | RNF01 - O sistema **deve** funcionar offline se os arquivos forem servidos localmente. |
| **Must** | RNF02 - O site **deve** ser compatível com navegadores modernos. |
| **Must** | RNF03 - O sistema **deve** funcionar sem back-end ou banco de dados. |
| **Must** | RNF04 - O contrato dos dados **deve** ser estável o suficiente para permitir renderização consistente no front-end. |
| **Should** | RNF05 - O código **deveria** seguir boas práticas de acessibilidade. |
| **Should** | RNF06 - O layout **deveria** ser responsivo para diferentes tamanhos de tela. |
| **Should** | RNF07 - O tempo de carregamento **deveria** permanecer leve para arquivos locais. |
| **Could** | RNF08 - O site **poderia** usar cache local para melhorar performance. |

---

## 📂 Estrutura de Dados (Resumo)

Os dados estão organizados em arquivos `.json` por capítulo. Cada entrada contém:

- Nome do livro
- Número do capítulo
- Indicação do idioma original
- Bloco opcional de introdução
- Lista de versículos
  - Versículos compostos por palavras
  - Palavra no idioma original
  - Tradução literal em português
  - Tradução alternativa opcional
  - Strong opcional
  - Morfologia opcional
  - Referência opcional a nota via `notaId`
- Lista opcional de notas do capítulo
  - `id`
  - `versiculo`
  - `negrito`
  - `texto`

(Ver detalhes em `docs/Arquitetura.md`)

---

## Diretrizes de Tradução Interlinear (Grego Coiné)

Esta seção define princípios objetivos para a tradução interlinear no modo indicativo, com foco em aspecto verbal e fidelidade gramatical. A interlinear deve refletir tempo, aspecto, voz e modo sem harmonizar automaticamente com o português.

### Princípios gerais

- Priorizar o aspecto verbal sobre a fluidez estilística.
- Evitar "teologizar" o verbo: primeiro vem o valor gramatical.
- Não ajustar automaticamente o tempo verbal para soar mais natural.
- Distinguir sempre:
  - Tempo (quando ocorre)
  - Aspecto (como a ação é vista)
  - Voz (quem realiza a ação)
  - Modo (realidade, possibilidade, ordem etc.)

### Diretrizes por tempo verbal (modo indicativo)

#### Presente (aspecto linear/contínuo)

- Diretriz: refletir ação em progresso, repetida ou característica.
- Preferir: "estou fazendo"; alternativa neutra: "faço".
- Se habitual: "costumo fazer".

#### Imperfeito (aspecto linear no passado)

- Diretriz: marcar continuidade no passado.
- Preferir: "fazia"; alternativa: "estava fazendo".

#### Futuro (aspecto geral no futuro)

- Diretriz: ação futura simples.
- Usar: "farei", "fará", "farão".
- Não inserir certeza absoluta além do contexto.

#### Aoristo (aspecto pontual/global)

- Diretriz: evento visto como um todo, sem foco no processo.
- Preferir: pretérito perfeito simples ("fiz", "fez").
- Evitar formas contínuas ("estava fazendo").
- Observação: o aoristo é aspectual, não necessariamente instantâneo.

#### Perfeito (aspecto resultativo)

- Diretriz: ação concluída com resultado presente.
- Preferir: "tenho feito" ou forma resultativa ("está feito").

#### Mais-que-perfeito (resultado no passado)

- Diretriz: ação concluída com resultado existente no passado.
- Usar: "tinha feito" ou "estava feito".

### Voz verbal (complemento)

- Ativa: sujeito realiza a ação.
- Média: sujeito participa ou é afetado diretamente.
- Geralmente traduzir como ativa, observando nuance reflexiva quando explícita.
- Passiva: sujeito recebe a ação.
- Manter construção passiva sempre que possível.

### Regra especial para interlinear

A interlinear não deve:

- Interpretar intenções.
- Ajustar estilo literário.
- Harmonizar tempos por fluidez.

A interlinear deve:

- Refletir a forma verbal.
- Indicar continuidade quando houver.
- Marcar resultado quando presente no perfeito.
- Diferenciar claramente aoristo de imperfeito.

### Resumo operacional (indicativo)

| Tempo | Diretriz principal |
| ----- | ------------------ |
| Presente | Processo atual |
| Imperfeito | Processo passado |
| Futuro | Ação futura |
| Aoristo | Evento completo |
| Perfeito | Resultado presente |
| Mais-que-perfeito | Resultado no passado |

---

## 🧪 Critérios de Aceitação

- A navegação entre livros e capítulos funciona sem erros.
- O texto no idioma original e as traduções são exibidos corretamente.
- As notas explicativas são exibidas ao lado e acessíveis por clique.
- O sistema pode ser aberto e usado localmente sem conexão com servidor externo.
- Não há erros visuais ou funcionais em dispositivos móveis.
- O comportamento de Strong, morfologia e RTL respeita os campos presentes nos JSONs.

---

## 🛠 Tecnologias Utilizadas

- **HTML + CSS + JavaScript**
- TailwindCSS via CDN
- JSON
- Hospedagem estática

---

## 🗺 Roadmap de Funcionalidades Futuras

Os itens abaixo representam evolução futura e **não devem ser lidos como funcionalidades já implementadas**.

- [ ] Sistema de busca por palavras gregas
- [ ] Conexão com dicionário Strong mais completo
- [ ] Suporte a múltiplos idiomas
- [ ] Destacar palavras-chave ou expressões idiomáticas
- [ ] Exportar capítulo como PDF ou imagem

---

## 📌 Referências Técnicas

- [The SBL Greek New Testament](https://sblgnt.com)
- [Unicode Greek Characters](https://www.unicode.org/charts/PDF/U0370.pdf)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---
