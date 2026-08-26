# Páginas do jornal

Coloque aqui as imagens ou PDFs, de preferência um arquivo para cada página do jornal.

Depois, abra `pages.js` e cadastre cada arquivo:

```js
window.JOURNAL_PAGES = [
  { title: "Página 2", file: "content/pagina-01.jpg", type: "image" },
  { title: "Página 3", file: "content/pagina-02.pdf" },
];
```

A capa é criada automaticamente pelo site. Para trocar o símbolo, substitua `assets/logo.svg`.

As duas imagens usadas nesta edição são `1.jpeg` e `2.jpeg`. Ao trocar os arquivos, altere os caminhos e extensões também em `pages.js`.
