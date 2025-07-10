# Guia de Estilo do Projeto

Este documento define os **padrões e convenções adotados para a escrita do código e para o design visual do projeto**, garantindo consistência e qualidade.

---

## 1. Organização dos Arquivos

Organize seus arquivos por função:

- CSS em `/css/`
- JavaScript em `/js/`
- Templates HTML em `/templates/`
- Componentes reutilizáveis em `/shared/`
- Assets (imagens, ícones) em `/assets/`

Nomeie os arquivos de forma clara e consistente:
Use letras minúsculas e separação por hífen, ex:

- `main.js`
- `index.css`
- `capitulo-1.json`

---

## 2. HTML

### 2.1 Estrutura e Semântica

- Use tags HTML conforme o significado do conteúdo:
  - `<header>` para cabeçalho
  - `<nav>` para menus de navegação
  - `<main>` para o conteúdo principal
  - `<footer>` para rodapé

(`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, etc.).

- Evite usar `<div>` para tudo; prefira elementos que descrevem o conteúdo para melhorar acessibilidade.
- Mantenha a hierarquia de títulos correta (`<h1>` para título principal, `<h2>` para subtítulos, e assim por diante).

### 2.2 Atributos e Classes

- Use classes para estilizar, não ids, exceto para elementos que precisam ser únicos (ex: cabeçalho da página).
- Dê nomes descritivos às classes, que indiquem função ou componente, ex: `.nota`, `.breadcrumb`.

---

## 3. CSS

### 3.1 Organização

- Separe o CSS em arquivos por finalidade:
  - `index.css` para a página inicial.
  - `livro.css` para páginas de livros.
  - `nota.css` para notas explicativas.
  - `responsivo.css` para ajustes em dispositivos móveis.

### 3.2 Convenções de Nomenclatura

- Use nomes em português e que reflitam o conteúdo, ex: `.painel-notas`, `.titulo-livro`.
- Evite nomes genéricos como `.azul` ou `.grande`, pois dificultam a manutenção.

### 3.3 Boas Práticas

- Use **Flexbox** ou **Grid** para layout sempre que possível, evitando posicionamentos com `float` ou `position` fixo.
- Mantenha a consistência na indentação (2 espaços).
- Use variáveis CSS para cores e tamanhos que se repetem (exemplo: `--cor-primaria: #0055a5;`).

* Evite regras CSS muito específicas (ex: seletores com mais de 3 níveis) para facilitar manutenção.
* Mantenha o CSS o mais enxuto possível — evite repetições desnecessárias.

### 3.4 Responsividade

- Use media queries para adaptar o layout a diferentes tamanhos de tela.
- Priorize o mobile-first: escreva estilos para dispositivos móveis e depois para telas maiores.
- Teste o layout em diferentes dispositivos e resoluções.

---

## 4. JavaScript

### 4.1 Organização

- Separe o código em módulos, cada um com responsabilidade clara (`loader.js`, `renderer.js`, `notas.js`, etc.).
- Cada arquivo deve ter uma responsabilidade clara e pequena.

### 4.2 Nomenclatura

- Use nomes de variáveis e funções descritivos, ex:

  - `loadChapter()` para carregar capítulo
  - `renderVerse()` para renderizar versículo
  - `showNote()` para mostrar nota

- Use camelCase para nomes de variáveis e funções:
  Exemplo: `loadChapter`, `showNote`.

### 4.3 Comentários

- Comente o código explicando **o que** ele faz e **por que**, especialmente se não for óbvio.
- Evite comentários redundantes ou óbvios.

### 4.4 Boas práticas

- Use `const` para valores que não mudam, e `let` para variáveis mutáveis.
- Evite variáveis globais para não poluir o escopo global.
- Use funções puras e pequenas sempre que possível.

---

## 5. Controle de Versão e Commits

- Use Git para controle de versão.
- Use mensagens de commit no formato semântico, por exemplo:
  - `feat: adicionar página do livro Mateus`
  - `fix: corrigir bug no carregamento das notas`
  - `docs: atualizar guia de estilo`
- Sempre faça Pull Requests para revisão antes de integrar ao branch principal.

---

## 6. Acessibilidade

- Utilize atributos `alt` em imagens para leitores de tela.
- Utilize texto alternativo significativo.
- Garanta contraste adequado de cores.
- Utilize tags semânticas para facilitar o entendimento por motores de busca.

---
