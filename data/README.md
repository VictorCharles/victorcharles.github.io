# Dados do Portfólio

Os dados da página ficam divididos em três arquivos para facilitar manutenção:

- `hero.json`: conteúdo da home e do topo do portfólio.
- `featured-projects.json`: projetos em destaque.
- `archive-projects.json`: projetos antigos organizados por ano.

## Como editar

1. Abra o arquivo certo para o conteúdo que quer alterar.
2. Adicione ou remova itens copiando um bloco existente.
3. Mantenha os textos curtos.
4. Use `disabled: true` para links que não serão exibidos.

## Formato compacto

### `hero.json`

```json
{
  "name": "Victor Charles",
  "ey": "Texto de apoio do topo",
  "title": "Título principal",
  "subtitle": "Frase curta de contexto",
  "focusTitle": "Rótulo da lista de foco",
  "focus": ["Item 1", "Item 2"],
  "solveTitle": "O que eu resolvo",
  "solve": ["Problema 1", "Problema 2"],
  "metricsTitle": "Métricas",
  "metrics": [{ "value": "40%", "label": "resultado curto" }],
  "aboutTitle": "Sobre mim",
  "about": "Texto curto sobre seu jeito de trabalhar.",
  "developTitle": "Como eu desenvolvo sistemas",
  "develop": ["Padrão 1", "Padrão 2"],
  "cta": [{ "label": "Vamos conversar", "href": "#contato" }],
  "terminal": "> status: ..."
}
```

### `featured-projects.json`

```json
{
  "ey": "Top 3",
  "title": "Projetos em destaque",
  "subtitle": "Descrição curta da seção",
  "items": [
    {
      "ey": "Categoria",
      "title": "Nome do projeto",
      "status": "public",
      "summary": "Resumo em uma linha.",
      "details": ["Problema: ...", "Resultado: ...", "Stack: ..."],
      "tags": ["Tag 1", "Tag 2"],
      "links": [
        { "label": "Código", "href": "https://...", "ghost": true },
        { "label": "Demo", "disabled": true }
      ]
    }
  ]
}
```

### `archive-projects.json`

```json
{
  "ey": "Contexto histórico",
  "title": "Outros projetos",
  "subtitle": "Texto curto de apoio",
  "years": [
    {
      "year": "2020",
      "items": [
        {
          "ey": "Categoria",
          "title": "Nome do projeto",
          "status": "private",
          "summary": "Resumo em uma linha.",
          "details": ["Problema: ...", "Resultado: ..."],
          "tags": ["Tag 1", "Tag 2"],
          "links": [{ "label": "Código", "disabled": true }]
        }
      ]
    }
  ]
}
```

## Regras rápidas

- Use `status` como `public` ou `private`.
- Use `ghost: true` para link secundário destacado.
- Se não houver link, marque como `disabled: true`.
- Se quiser destacar um projeto, deixe ele primeiro na lista.
