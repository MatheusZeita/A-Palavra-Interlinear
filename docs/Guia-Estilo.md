# Guia de Estilo do Projeto

Este documento define os **padrões e convenções adotados para a escrita do código e para o design visual do projeto**, garantindo consistência e qualidade.

---

## 1. Organização dos Arquivos

Organize os arquivos por função:

- CSS em `/css/`
- JavaScript em `/js/`
- Páginas HTML em `/pages/`
- Componentes reutilizáveis em `/shared/`
- Recursos visuais em `/assets/`
- Documentação em `/docs/`

Nomeie arquivos de forma clara e consistente:

- Use letras minúsculas
- Use hífen quando necessário
- Evite nomes genéricos

Exemplos:

- `index.css`
- `capitulo.css`
- `morfologia.css`

---

## 2. HTML

### 2.1 Estrutura e Semântica

- Use tags HTML conforme o significado do conteúdo.
- Prefira `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` e `<footer>` quando fizer sentido.
- Evite usar `<div>` para tudo.
- Mantenha a hierarquia correta de títulos (`<h1>`, `<h2>`, `<h3>`).

### 2.2 Atributos e Classes

- Use classes para estilização.
- Use `id` apenas para elementos únicos, âncoras, integração com JavaScript ou acessibilidade.
- Dê nomes descritivos às classes, indicando função ou componente.

Exemplos:

- `.painel-notas`
- `.titulo-livro`
- `.cartao-capitulo`

---

## 3. CSS

### 3.1 Diretriz Geral

Este projeto **não usa Tailwind**. Toda estilização deve ser feita com **CSS autoral**, escrito e mantido nos arquivos de `/css/`.

Por isso:

- Não adicione classes utilitárias no HTML como forma principal de estilização.
- Não dependa de convenções visuais vindas de frameworks CSS.
- Centralize decisões visuais em arquivos `.css`.
- Prefira classes semânticas e reutilizáveis.

### 3.2 Organização dos Arquivos CSS

Use a seguinte separação:

- `styles.css` para tokens, reset leve e estilos compartilhados
- `index.css` para a página inicial
- `livro.css` para a página do livro
- `capitulo.css` para a página do capítulo
- `morfologia.css` para a página de morfologia

Regras:

- Cada arquivo deve conter apenas estilos da sua responsabilidade.
- Estilos compartilhados não devem ser duplicados em múltiplos arquivos.
- Se uma regra começa a aparecer em várias páginas, mova-a para `styles.css`.
- Evite colocar estilos de página dentro de arquivos compartilhados.

### 3.3 Ordem Interna dos Blocos

Dentro de cada arquivo CSS, mantenha uma ordem previsível:

1. Variáveis e tokens
2. Base global da página
3. Layout
4. Componentes
5. Estados
6. Responsividade

Exemplo:

```css
:root {
  --cor-primaria: #1d386d;
}

body {
  margin: 0;
}

.layout-capitulo {
  display: grid;
}

.painel-notas {
  background: #f1f5f9;
}

.painel-notas.is-aberto {
  opacity: 1;
}

@media (max-width: 800px) {
  .layout-capitulo {
    grid-template-columns: 1fr;
  }
}
```

### 3.4 Convenções de Nomenclatura

- Use nomes em português sempre que possível.
- Nomeie classes pela função, não pela aparência.
- Evite nomes como `.azul`, `.grande`, `.box1`, `.left`.
- Prefira nomes de componente, elemento e estado.

Bons exemplos:

- `.catalogo-escrituras`
- `.cartao-livro`
- `.titulo-secao`
- `.painel-notas`
- `.painel-notas--fixo`
- `.is-rtl`

Evite:

- `.bg-blue-850`
- `.text-big`
- `.mt-4`
- `.right-panel`

### 3.5 Tokens Visuais e Variáveis CSS

Toda decisão visual repetida deve virar variável CSS.

Crie tokens para:

- cores
- espaçamentos
- bordas
- sombras
- larguras máximas
- fontes
- tempos de animação
- z-index recorrentes

Exemplo:

```css
:root {
  --cor-fundo: #e5e7eb;
  --cor-superficie: #f8fafc;
  --cor-texto: #0f172a;
  --cor-destaque: #1d386d;
  --espaco-1: 4px;
  --espaco-2: 8px;
  --espaco-3: 12px;
  --espaco-4: 16px;
  --borda-raio-padrao: 8px;
  --sombra-painel: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

Boas práticas:

- Declare tokens globais em `styles.css`.
- Use nomes estáveis e legíveis.
- Não espalhe hexadecimais aleatórios pelos arquivos.
- Não crie variáveis desnecessárias para valores usados uma única vez, a menos que sejam valores de identidade visual.

### 3.6 Layout

- Use **Flexbox** e **Grid** como ferramentas principais.
- Evite `float` para layout.
- Use `position: absolute` ou `position: fixed` apenas quando houver necessidade real.
- Preserve uma estrutura clara entre contêiner, conteúdo principal e componentes laterais.
- Prefira `gap` em vez de combinar várias margens manuais.

Boas práticas:

- Use `max-width` para controlar legibilidade.
- Use `min-width: 0` em itens flex/grid quando houver risco de overflow.
- Use `width: 100%` com critério, não por reflexo.
- Defina a responsabilidade de cada contêiner: fluxo, alinhamento, largura ou espaçamento.

### 3.7 Componentes

Pense o CSS por componentes, não por trechos soltos de página.

Cada componente deve ter:

- nome claro
- propósito único
- estados previsíveis
- baixa dependência da estrutura ao redor

Exemplos de componentes do projeto:

- cartão de livro
- cartão de capítulo
- painel de notas
- marcador de nota
- cabeçalho do capítulo

Evite:

- estilizar componentes apenas pelo contexto do DOM
- depender de seletores longos demais
- acoplar o visual a uma árvore HTML muito rígida

### 3.8 Estados e Modificadores

Estados devem ser explícitos.

Prefira:

- `.is-aberto`
- `.is-ativo`
- `.is-rtl`
- `.painel-notas--mobile`

Evite:

- depender de combinações frágeis de ancestrais
- duplicar o componente inteiro para criar uma variação pequena

### 3.9 Especificidade

Mantenha a especificidade baixa e previsível.

Regras:

- Prefira classes a seletores por tag.
- Evite cadeias longas como `.pagina .conteudo .bloco .item span`.
- Evite usar `!important`.
- Só use `id` em CSS se houver uma justificativa forte.

Objetivo:

- permitir sobrescritas fáceis
- evitar disputas entre regras
- facilitar manutenção e refatoração

### 3.10 Tipografia

- Defina famílias tipográficas por contexto de uso.
- Use escala de tamanhos consistente.
- Controle `line-height`, `font-weight` e contraste com intenção.
- Não aplique ajustes tipográficos diretamente no HTML com classes utilitárias.

Recomendação:

- uma família principal para interface
- uma família para títulos e texto bíblico, quando fizer sentido editorialmente

### 3.11 Espaçamento

Padronize espaçamentos com escala.

Exemplo de escala:

- `4px`
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `48px`

Boas práticas:

- Use `gap` para espaçamento entre itens irmãos.
- Use `padding` para respiro interno.
- Use `margin` com parcimônia, especialmente em componentes reutilizáveis.

### 3.12 Cores e Estados Interativos

- Cores devem vir de tokens.
- Todo estado interativo precisa ser visível.
- Links, botões e áreas clicáveis devem ter `:hover` e `:focus-visible`.
- Contraste deve ser suficiente para leitura confortável.

Sempre prever:

- estado normal
- hover
- focus-visible
- estado desabilitado, quando aplicável

### 3.13 Responsividade

O projeto deve seguir abordagem **mobile-first**.

Regras:

- Escreva primeiro o estilo base para telas menores.
- Adicione media queries para ampliar ou reorganizar o layout.
- Evite media queries aninhadas.
- Use breakpoints consistentes ao longo do projeto.

Boas práticas:

- documente breakpoints recorrentes
- teste overflow horizontal
- teste comportamento de painéis laterais
- teste tipografia e áreas clicáveis em telas pequenas

### 3.14 Comentários e Seções

Use comentários curtos apenas quando ajudarem a entender a estrutura.

Exemplos:

- `/* Tokens */`
- `/* Layout do capítulo */`
- `/* Painel de notas */`
- `/* Responsividade */`

Evite comentários óbvios ou redundantes.

### 3.15 O Que Evitar

- classes utilitárias herdadas da lógica do Tailwind
- nomes baseados só em cor ou tamanho
- repetição de valores visuais em vários arquivos
- media queries aninhadas
- seletores excessivamente específicos
- mistura de estilo de componente com estilo de página sem critério
- uso frequente de valores mágicos sem documentação
- CSS dependente demais do HTML atual

### 3.16 Checklist Antes de Finalizar um CSS

Antes de concluir uma alteração:

- O nome das classes descreve função e não aparência?
- Os valores repetidos viraram variáveis?
- Há duplicação com outro arquivo CSS?
- O componente funciona em mobile e desktop?
- Os estados interativos estão visíveis?
- A especificidade está baixa?
- O layout evita overflow acidental?
- O estilo foi colocado no arquivo certo?

---

## 4. JavaScript

### 4.1 Organização

- Separe o código em módulos quando isso reduzir acoplamento e melhorar clareza.
- Cada arquivo deve ter uma responsabilidade clara.

### 4.2 Nomenclatura

- Use nomes de variáveis e funções descritivos.
- Use camelCase para variáveis e funções.

Exemplos:

- `loadChapter`
- `renderVerse`
- `showNote`

### 4.3 Comentários

- Comente o código explicando **o que** ele faz e **por que**, especialmente quando a intenção não for óbvia.
- Evite comentários redundantes.

### 4.4 Boas práticas

- Use `const` para valores imutáveis e `let` para variáveis mutáveis.
- Evite variáveis globais.
- Prefira funções pequenas e previsíveis.

---

## 5. Controle de Versão e Commits

- Use Git para controle de versão.
- Use mensagens de commit semânticas.

Exemplos:

- `feat: adicionar página do livro Mateus`
- `fix: corrigir abertura do painel de notas`
- `docs: atualizar guia de estilo`
- `refactor: padronizar tokens de cor no CSS`

---

## 6. Acessibilidade

- Use contraste adequado de cores.
- Garanta navegação por teclado onde houver interação.
- Use `:focus-visible` em elementos interativos.
- Utilize tags semânticas para melhorar leitura por tecnologias assistivas.
- Utilize `alt` significativo em imagens.
- Evite depender apenas de cor para comunicar estado.

---
