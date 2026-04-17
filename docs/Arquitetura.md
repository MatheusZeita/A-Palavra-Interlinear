# Arquitetura do Projeto

Este documento descreve a arquitetura geral do projeto, incluindo a **estrutura de dados**, o **fluxo de carregamento** e a **interação com o front-end**.

---

## 🔍 Visão Geral

O projeto apresenta uma tradução interlinear das Escrituras, exibindo o texto no idioma original e a tradução palavra por palavra em português. O conteúdo é armazenado em arquivos JSON estáticos e renderizado dinamicamente no navegador com HTML, CSS e JavaScript.

---

## ✅ Arquitetura Atual

O estado atual do projeto é baseado em páginas estáticas dedicadas e scripts específicos por página:

1. `pages/index.html` lista os livros usando `data/interlinear/livros.json`.
2. `pages/livro.html` exibe os capítulos do livro selecionado.
3. `pages/capitulo.html` carrega o JSON do capítulo e renderiza o texto interlinear.
4. As notas são exibidas em painel lateral próprio.
5. `js/main.js` injeta `shared/header.html` e `shared/footer.html`.

Hoje essa é a arquitetura em uso no código, e a documentação abaixo descreve esse estado como referência principal.

---

## 🧩 Responsabilidades Atuais

Os principais arquivos da implementação atual são:

- `pages/index.html`: catálogo das Escrituras Hebraicas e Cristãs.
- `pages/livro.html`: lista de capítulos de um livro específico.
- `pages/capitulo.html`: leitura interlinear, cabeçalho do capítulo e painel de notas.
- `pages/morfologia.html`: guia estático para abreviações morfológicas.
- `js/main.js`: carregamento do header e footer compartilhados.
- `js/index.js`: busca de `livros.json` e renderização dos cards dos livros.
- `js/livro.js`: leitura de `?posicao=`, seleção do livro e renderização dos capítulos.
- `js/capitulo.js`: leitura de `?livro=` e `?capitulo=`, carregamento do capítulo, renderização do interlinear, notas, Strong, morfologia e direção RTL.
- `js/linguagem/*.js`: transliteração e decodificação morfológica usadas na renderização.

---

## 🔄 Fluxo Atual de Funcionamento

1. **Carregamento base**
   - A página HTML é carregada com áreas reservadas para conteúdo e componentes compartilhados.

2. **Componentes compartilhados**
   - `js/main.js` injeta `shared/header.html` e `shared/footer.html`.

3. **Leitura da URL**
   - `js/livro.js` usa `?posicao=`.
   - `js/capitulo.js` usa `?livro=` e `?capitulo=`.

4. **Carregamento de dados**
   - O front-end busca `data/interlinear/livros.json`.
   - Na página de capítulo, busca também `data/interlinear/<posicao>/<capitulo>.json`.

5. **Renderização**
   - Os scripts transformam os JSONs em elementos HTML.
   - Na página do capítulo, cada palavra pode exibir tradução, original, Strong, morfologia e marcador de nota.

6. **Notas e navegação contextual**
   - O painel lateral agrupa notas por versículo.
   - Clicar no asterisco da palavra leva à nota.
   - Clicar no asterisco da nota leva de volta à palavra.

---

## 🏗️ Estrutura Básica do Site

O site é dividido em páginas estáticas que exibem:

- Página inicial com **lista interativa dos livros** da Bíblia
- Página do livro com **lista de capítulos**
- Página do capítulo com **leitura interlinear** e **notas**
- Página auxiliar com **guia de morfologia grega**

---

## 📁 Estrutura de Diretórios

```text
A-Palavra-Interlinear/
│
├── assets/                         # Arquivos estáticos (imagens, ícones, PDFs)
├── css/                            # Estilos por página e estilos compartilhados
├── data/
│   └── interlinear/                # Arquivos JSON com livros e capítulos
│       ├── 40/                     # Pasta do livro, identificada por `posicao`
│       ├── 43/
│       ├── 66/
│       └── livros.json
├── docs/                           # Documentação do projeto
├── js/
│   ├── main.js                     # Header e footer compartilhados
│   ├── index.js                    # Catálogo de livros
│   ├── livro.js                    # Lista de capítulos
│   ├── capitulo.js                 # Leitura interlinear e notas
│   └── linguagem/                  # Transliteração e morfologia
├── pages/                          # Páginas HTML do site
├── shared/                         # Componentes HTML reutilizáveis
└── README.md
```

---

## 📦 Contrato Atual dos Dados

### `livros.json`

Estrutura geral:

```json
{
  "EscriturasHebraicas": [],
  "EscriturasCristas": []
}
```

Campos comuns em cada livro:

- `posicao`
- `completo`
- `medio`
- `curto`
- `capitulos`
- `titulo original`
- `titulo traduzido`
- `transliteracao` quando aplicável

### Capítulo

Cada capítulo bíblico é representado por um arquivo `data/interlinear/<posicao>/<capitulo>.json`.

Campos de alto nível:

- `livro`
- `capitulo`
- `idioma`
- `introducao` *(opcional)*
- `versiculos`
- `notas` *(opcional)*

Campos comuns em `introducao.palavras` e `versiculos[].palavras`:

- `original`
- `traducao`
- `traducao2` *(opcional)*
- `strongId` *(opcional)*
- `morfologia` *(opcional)*
- `notaId` *(opcional)*
- `fimParagrafo` *(opcional)*

Campos comuns em `notas[]`:

- `id`
- `versiculo`
- `negrito` *(opcional)*
- `texto`

Convenções usadas atualmente pelo front-end:

- O livro é localizado por `posicao`.
- O arquivo do capítulo usa zero-padding:
  - `01.json` a `99.json`
  - `100.json` em diante
- `notaId` referencia uma entrada em `notas`.
- `traducao2`, quando presente, é exibido como tooltip.
- `morfologia`, quando presente em grego, gera tooltip explicativo e link para `morfologia.html`.
- `strongId`, quando presente, gera link externo para BibleHub.
- `idioma: "hebraico"` ativa direção RTL na renderização.

Exemplo:

```json
{
  "livro": "Mateus",
  "capitulo": 1,
  "idioma": "grego",
  "versiculos": [
    {
      "numero": 1,
      "palavras": [
        { "original": "Βίβλος", "traducao": "Livro" },
        {
          "original": "γενέσεως",
          "traducao": "de origem",
          "notaId": "n1"
        }
      ]
    }
  ],
  "notas": [
    {
      "id": "n1",
      "versiculo": 1,
      "negrito": "γενέσεως",
      "texto": "Ou, possivelmente: “de genealogia; geração; nascimento”."
    }
  ]
}
```

---

## 🔗 Navegação Atual por URL

A navegação atual usa páginas dedicadas e parâmetros simples na URL:

- `livro.html?posicao=40`
- `capitulo.html?livro=40&capitulo=1`

Esse formato reduz a quantidade de páginas estáticas duplicadas e mantém a lógica concentrada nos scripts de cada tela.

---

## 🛠 Tecnologias Utilizadas

- **HTML + CSS + JavaScript**
- TailwindCSS via CDN
- JSON para armazenamento de conteúdo estruturado

---

## 📌 Considerações Técnicas

- O sistema funciona sem back-end.
- O site deve ser servido por servidor local ou hospedagem estática.
- A estrutura atual facilita adicionar novos livros e capítulos sem alterar a arquitetura.
- A arquitetura atual já suporta capítulos em grego e hebraico.

---

## 🚧 Evolução Planejada

Os itens abaixo são possibilidades de evolução. Eles **não descrevem o estado atual** do código.

- Extrair responsabilidades maiores de `js/capitulo.js` para módulos dedicados, como `loader.js`, `renderer.js`, `notas.js` e `navigation.js`.
- Formalizar breadcrumbs quando a navegação for implementada visualmente.
- Adicionar validação automatizada para o contrato dos JSONs.
- Expandir mecanismos de busca, filtros e internacionalização.
