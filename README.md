# A Palavra Interlinear — Tradução da Bíblia Sagrada

Site estático que apresenta uma **tradução interlinear** do texto grego e hebraico da Bíblia para o português — o texto no idioma original acompanhado da tradução literal de cada palavra — com análise morfológica, números de Strong e transliteração.

## Sobre

A Bíblia é um conjunto de livros inspirados por Deus para transmitir sua mensagem à humanidade. Seus primeiros livros, conhecidos como Escrituras Hebraicas, foram escritos principalmente em hebraico clássico. Já as Escrituras Gregas Cristãs foram compostas em grego coiné no primeiro século da Era Comum.

A própria Bíblia revela que sua mensagem deveria ser anunciada a “toda nação, tribo, língua e povo” — o que torna a tradução essencial. — Apocalipse 14:6.

Uma tradução interlinear apresenta o texto no idioma original acompanhado de sua tradução literal. Dessa forma, mesmo quem não conhece hebraico ou grego consegue visualizar o sentido exato de cada termo.

Como a gramática, o vocabulário e a sintaxe desses idiomas diferem bastante das línguas modernas, como o português, esse tipo de tradução não é prática para leitura cotidiana. Logo, uma tradução interlinear não substitui traduções normais, como a *<a href="https://wol.jw.org/pt/wol/binav/r5/lp-t" target="_blank" rel="noopener noreferrer">Tradução do Novo Mundo</a>*. Ainda assim, ela é de grande valor para quem deseja compreender com mais precisão o significado original das Escrituras.

**A Palavra Interlinear** é um projeto pessoal inspirado na *<a href="https://wol.jw.org/en/wol/binav/r1/lp-e/int" target="_blank" rel="noopener noreferrer">Tradução Interlinear do Reino das Escrituras Gregas</a>*, de língua inglesa, produzida pela *Watchtower Bible and Tract Society of New York, Inc*.

Espero que essa nova tradução possa ajudar os estudantes da Bíblia de língua portuguesa a se aproximarem de Jeová Deus e do seu Filho, dando glória a eles por meio do conhecimento da Palavra de Deus.

> “Tua palavra é lâmpada para o meu pé, e luz para o meu caminho.” — Salmo 119:105.

## Destaques

- Catálogo interativo de livros
- Navegação por livro e capítulo
- Texto interlinear palavra a palavra
- Números de Strong com links de referência
- Morfologia grega decifrada em tooltips
- Suporte a RTL para hebraico
- Design responsivo

## Estrutura do projeto

- `pages/` páginas HTML
- `js/` scripts da aplicação
- `css/` estilos
- `data/interlinear/` dados em JSON
- `shared/` header e footer compartilhados
- `assets/` imagens e favicons

## Dados

### Contrato Atual dos Dados

Os arquivos JSON em `data/interlinear/` formam o contrato atual entre os dados e o front-end.

Convenções gerais:

- Cada livro é identificado por `posicao`.
- Cada capítulo fica em `data/interlinear/<posicao>/<capitulo>.json`.
- O nome do arquivo do capítulo usa zero-padding:
- `01.json` a `99.json`
- `100.json` em diante
- As palavras podem referenciar notas por `notaId`.
- As notas ficam centralizadas no bloco `notas` do capítulo.
- Capítulos em hebraico usam direção RTL no front-end.

### Livros

Arquivo: `data/interlinear/livros.json`

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

### Capítulos

Arquivo: `data/interlinear/<posicao>/<capitulo>.json`

Exemplo de estrutura:

```json
{
  "livro": "1 Coríntios",
  "capitulo": 13,
  "idioma": "grego",
  "introducao": {
    "palavras": []
  },
  "versiculos": [
    {
      "numero": 1,
      "palavras": [
        {
          "original": "ἐὰν",
          "traducao": "Se",
          "strongId": "1437",
          "morfologia": "Conj",
          "notaId": "n1"
        }
      ]
    }
  ],
  "notas": [
    {
      "id": "n1",
      "versiculo": 1,
      "negrito": "ἐὰν",
      "texto": "Exemplo de nota."
    }
  ]
}
```

Campos comuns em `palavras`:

- `original`
- `traducao`
- `traducao2`
- `strongId`
- `morfologia`
- `notaId`
- `fimParagrafo`

Campos comuns em `notas`:

- `id`
- `versiculo`
- `negrito`
- `texto`

Campos opcionais adicionais do capítulo:

- `introducao.palavras`

## URLs Atuais

O projeto usa parâmetros simples de URL para navegação:

- `pages/livro.html?posicao=40`
- `pages/capitulo.html?livro=40&capitulo=1`

## Como executar

Por segurança do navegador, **não abra o projeto via `file://`**. Use um servidor local.

Exemplo com Python:

```bash
python -m http.server
```

Depois acesse:

- `http://localhost:8000/pages/index.html`

Se preferir, use a extensão **Live Server** no VS Code.

## Licença

Creative Commons Attribution 4.0 International (CC BY 4.0)
