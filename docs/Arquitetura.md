# Arquitetura do Projeto

Este documento descreve a arquitetura geral do projeto, incluindo a **estrutura de dados**, o **fluxo de carregamento** e a **interação com o front-end**.

---

## 🔍 Visão Geral

O projeto tem como objetivo apresentar uma tradução interlinear das Escrituras, exibindo o texto no idioma original (hebraico clássico ou grego *koiné*) e a tradução palavra por palavra, com notas explicativas (opcionais) ao lado. O conteúdo é estruturado em arquivos JSON, um para cada capítulo, e renderizado dinamicamente via HTML + JavaScript.

---

## ✅ Fases de Implementação (Simples)

Para facilitar o aprendizado e evitar complexidade, a implementação pode ser feita em passos pequenos:

1. Página inicial lista os livros usando `capitulos/livros.json`.
2. `livro.html` exibe a lista de capítulos do livro selecionado.
3. `capitulo.html` carrega o JSON do capítulo e renderiza o texto interlinear básico.
4. Notas, breadcrumbs e melhorias visuais.

Essa abordagem gera resultados rápidos e visuais, mantendo o código simples no começo.

---

## ✅ Arquitetura Mínima (MVP)

Para iniciantes, a arquitetura pode começar **bem simples**:

- `index.html` para o catálogo de livros.
- `livro.html` para listar os capítulos do livro selecionado.
- `capitulo.html` para exibir a leitura interlinear de um capítulo.
- `js/main.js` com toda a lógica no começo.

Quando estiver confortável, o `main.js` pode ser dividido em módulos menores (`loader.js`, `renderer.js`, etc.).

---

## 🏗️ Estrutura Básica do Site

O site é dividido em páginas estáticas que exibem:

- Página inicial com **lista interativa dos livros** da Bíblia
- Página do livro com **lista de capítulos**, com **breadcrumbs** de navegação
- Página do capítulo com **leitura interlinear** e **notas**

---

## 📁 Estrutura de Diretórios

A estrutura do projeto é modular e organizada para facilitar a manutenção, a escalabilidade e a clareza. Abaixo está a descrição de cada pasta e arquivo:

```
A-Palavra-Interlinear/
│
├── assets/                         # Arquivos estáticos (imagens, ícones, fontes)
│   ├── logo.png
│   ├── favicon.ico
│   └── ...
│
├── capitulos/                      # Arquivos JSON com os textos interlineares
│   ├── mateus/                     # Arquivos JSON do livro em questão
│   │   ├── 01.json                 # Estrutura com versículos, palavras, traduções e notas
│   │   ├── 02.json
│   │   └── ...
│   ├── marcos/
│   ├── lucas/
│   ├── joao/
│   ├── atos/
│   ├── romanos/
│   ├── ...                         # Todos os livros e seus capítulos
│   └── livros.json                 # Informações dos livros (nomes, nº de capítulos, etc.)
│
├── css/                            # Estilos CSS customizados
│   ├── index.css                   # Estilo da página inicial
│   ├── styles.css                  # Estilos base e reutilizáveis
│   ├── livro.css                   # (Opcional) Estilo específico para leitura
│   ├── nota.css                    # (Opcional) Estilização da seção de notas
│   └── responsivo.css              # (Opcional) Ajustes para dispositivos móveis
│
├── docs/                           # Documentação do projeto
│   ├── Arquitetura.md              # Arquitetura técnica e estrutura do sistema
│   ├── Como-Contribuir.md          # Guia para contribuidores
│   ├── Especificacao.md            # Objetivos principais e requisitos do projeto
│   ├── Guia-Estilo.md              # Padrões de estilo e estrutura do HTML/CSS
│   └── Metodologia-Textual.md      # ...
│
├── js/                             # Scripts JavaScript
│   ├── main.js                     # Script principal (início simples)
│   ├── loader.js                   # (Futuro) Carregamento de dados JSON
│   ├── renderer.js                 # (Futuro) Renderização dos versículos e palavras
│   ├── notas.js                    # (Futuro) Exibição e navegação das notas
│   ├── navigation.js               # (Futuro) Navegação entre livros e capítulos
│   └── utils.js                    # (Futuro) Funções auxiliares
│
├── shared/                         # Componentes HTML reutilizáveis
│   ├── header.html                 # Cabeçalho com navegação global
│   ├── footer.html                 # Rodapé comum
│   ├── aside-notas.html            # Painel lateral de notas explicativas
│   ├── nav-livros.html             # Navegação entre livros
│   └── card-versiculo.html         # Estrutura reutilizável de um versículo
│
├── index.html                      # Página inicial com a lista dos livros
├── livro.html                      # Página que lista capítulos do livro
├── capitulo.html                   # Página do capítulo interlinear
│
└── README.md                       # Visão geral do projeto e instruções
```

---

## 📦 Estrutura do JSON do Capítulo

Cada capítulo bíblico é representado por um arquivo `.json` com a seguinte estrutura:

- `livro`: Nome do livro bíblico.
- `capitulo`: Número do capítulo.
- `idioma`: Idioma original do livro (hebraico ou grego).
- `versiculos`: Lista de versículos do capítulo, com:

  - `numero`: Número do versículo.
  - `palavras`: Lista de objetos, com:

    - `original`: Palavra no idioma original.
    - `traducao`: Tradução da palavra correspondente em português.
    - `nota` *(opcional)*: Nota explicativa vinculada à palavra.
    - `paragrafo` *(opcional)*: Indicação especial para marcar o início de parágrafo.

### Exemplo:

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
          "nota": "Ou, possivelmente: “de genealogia; geração; nascimento”."
        }
      ]
    }
  ]
}
```

---

## 🔄 Fluxo de Funcionamento

1. **Carregamento da Página**
   - Um modelo HTML básico é carregado, com `div`s reservadas para o conteúdo.

2. **Carregamento do JSON**
   - Um script JS requisita dinamicamente o arquivo JSON correspondente ao capítulo solicitado.

3. **Renderização**
   - O script percorre os versículos e renderiza cada palavra com:
   - A tradução visível.
   - A palavra grega/hebraica.
   - Um asterisco com nota, se houver.

4. **Exibição das Notas**
   - Notas são exibidas em uma seção lateral. Ao clicar sobre o asterisco, o usuário é direcionado para a nota correspondente.

---

## 🔗 Navegação Simples com URL

Uma abordagem simples é usar **duas páginas dedicadas** e passar parâmetros pela URL:

- `livro.html?livro=mateus`
- `capitulo.html?livro=mateus&cap=1`

Vantagens:
- Menos arquivos do que um por livro/capítulo.
- Lógica organizada por etapa (lista de capítulos e leitura).
- Fácil de entender e evoluir.

---

## 🛠 Tecnologias Utilizadas

- **HTML + CSS + JavaScript**
- Tailwind (opcional)
- JSON para armazenamento de conteúdo estruturado

---

## 📌 Considerações Técnicas

- O sistema pode funcionar offline se os arquivos estiverem localmente disponíveis.
- A estrutura modular permite que sejam adicionados novos livros ou capítulos com facilidade.
- A arquitetura facilita a internacionalização futura (por exemplo, traduções em outros idiomas).
