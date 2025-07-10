# 🏗 Arquitetura do Projeto - Tradução Interlinear das Escrituras

Este documento descreve a arquitetura geral do site de tradução interlinear das Escrituras Cristças, incluindo a estrutura de dados, o fluxo de carregamento e a interação com o front-end.

---

## 🔍 Visão Geral

O projeto tem como objetivo apresentar uma tradução interlinear das Escrituras, exibindo o texto grego e a tradução palavra por palavra, com notas explicativas (opcionais) ao lado. O conteúdo é estruturado em arquivos JSON, um para cada capítulo, e renderizado dinamicamente via HTML + JavaScript.

---

## 📁 Estrutura de Diretórios

A estrutura do projeto é modular e organizada para facilitar a manutenção, a escalabilidade e a clareza. Abaixo está a descrição de cada pasta e arquivo:

```

INTERLINEAR---EC/
│
├── assets/                         # Arquivos estáticos (imagens, ícones, fontes)
│   ├── logo.png
│   ├── favicon.ico
│   └── ...
│
├── capitulos/                      # Arquivos JSON com os textos interlineares
│   ├── mateus/                     # Arquivos JSON do livro em questão
│   │   ├── capitulo-1.json         # Estrutura com versículos, palavras, traduções e notas
│   │   ├── capitulo-2.json
│   │   └── ...
│   ├── marcos/
│   ├── lucas/
│   ├── joao/
│   ├── atos/
│   ├── romanos/
│   └── ...                         # Todos os livros e seus capítulos
│
├── css/                            # Estilos CSS customizados
│   ├── index.css                   # Estilo da página inicial
│   ├── styles.css                  # Estilos base e reutilizáveis
│   ├── livro.css                   # Estilo específico para páginas de livros
│   ├── nota.css                    # Estilização da seção de notas
│   └── responsivo.css              # Ajustes para dispositivos móveis
│
├── docs/                           # Documentação do projeto
│   ├── Arquitetura.md              # Arquitetura técnica e estrutura do sistema
│   ├── Guia-Estilo.md              # Padrões de estilo e estrutura do HTML/CSS
│   └── Como-Contribuir.md          # Guia para contribuidores
│
├── js/                             # Scripts JavaScript modulares
│   ├── main.js                     # Script principal de inicialização
│   ├── loader.js                   # Carregamento de dados JSON
│   ├── renderer.js                 # Renderização dos versículos e palavras
│   ├── notas.js                    # Lógica de exibição e navegação das notas
│   ├── navigation.js               # Navegação entre livros e capítulos
│   └── utils.js                    # Funções auxiliares (ex: ordenação, normalização)
│
├── templates/                      # Páginas base de cada livro bíblico, com seus capítulos
│   └── livros/
│       ├── mateus.html
│       ├── marcos.html
│       ├── lucas.html
│       ├── joao.html
│       ├── romanos.html
│       └── ...                     # Todos os livros bíblicos
│
├── shared/                         # Componentes HTML reutilizáveis
│   ├── header.html                 # Cabeçalho com navegação global
│   ├── footer.html                 # Rodapé comum
│   ├── aside-notas.html            # Painel lateral de notas explicativas
│   ├── nav-livros.html             # Navegação entre livros
│   └── card-versiculo.html         # Estrutura reutilizável para um versículo interlinear
│
├── index.html                      # Página inicial com a lista dos livros
│
└── README.md                       # Visão geral do projeto, propósito e instruções

```

---

## 📦 Estrutura do JSON do Capítulo

Cada capítulo bíblico é representado por um arquivo `.json` com a seguinte estrutura:

```json
{
  "livro": "Mateus",
  "capitulo": 1,
  "versiculos": [
    {
      "numero": 1,
      "palavras": [
        { "grego": "Βίβλος",
          "traducao": "Livro"
        },
        {
          "grego": "γενέσεως",
          "traducao": "da genealogia",
          "nota": "Ou: 'história; linhagem; origem'."
        },
        . . .
      ]
    }
  ]
}
```

### Campos:

- `livro`: Nome do livro bíblico.
- `capitulo`: Número do capítulo.
- `versiculos`: Lista de versículos.

  - `numero`: Número do versículo.
  - `palavras`: Lista de objetos com:

    - `grego`: Palavra original em grego _koiné_.
    - `traducao`: Tradução da palavra.
    - `nota` _(opcional)_: Nota explicativa vinculada à palavra.

---

## 🔄 Fluxo de Funcionamento

1. **Carregamento da Página**

   - Um modelo HTML básico é carregado, com `div`s reservadas para o conteúdo.

2. **Carregamento do JSON**

   - Um script JS requisita dinamicamente o arquivo JSON correspondente ao capítulo solicitado.

3. **Renderização**

   - O script percorre os versículos e renderiza cada palavra com:

     - A tradução visível.
     - A palavra grega.
     - Um asterisco com nota, se houver.

4. **Exibição das Notas**

   - Notas são exibidas em uma seção lateral. Ao clicar sobre o asterisco, o usuário é direcionado para a nota correspondente.

---

## 🛠 Tecnologias Utilizadas

- **HTML + CSS + JavaScript**
- Tailwind
- JSON para armazenamento de conteúdo estruturado

---

## 📌 Considerações Técnicas

- O sistema pode funcionar offline se os arquivos estiverem localmente disponíveis.
- A estrutura modular permite que sejam adicionados novos livros ou capítulos com facilidade.
- A arquitetura facilita a internacionalização futura (por exemplo, traduções em outros idiomas).

---

## 🧱 Possibilidades Futuras

- Sistema de busca por palavras gregas.
- Conexão com dicionários léxicos (ex: Strong).
- Navegação entre capítulos e livros.

---

## 🔧 Controle de Versão e Contribuição

- O repositório usa **Git** para controle de versão.
- Branch principal: `main`
- Sugestão de fluxo de contribuição:
  - Crie uma branch por funcionalidade: `feature/nome`
  - Faça commits semânticos (`feat:`, `fix:`, `docs:` etc.)
  - Abra pull requests para revisão.

---

## 🧾 Convenções

A FAZER

---


