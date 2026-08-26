# O Abílio em Foco

Jornal digital estático do Colégio Estadual Abílio Carneiro, pronto para publicação no GitHub Pages.

## Como alimentar

1. Coloque as imagens ou PDFs das páginas na pasta `content/`.
2. Cadastre cada arquivo em `content/pages.js`.
3. Abra `index.html` diretamente no navegador para testar. Não é necessário instalar ou executar servidor.
4. Publique o repositório no GitHub e ative **Settings > Pages > Deploy from a branch**.

A primeira página é uma capa gerada automaticamente com a data do acesso. Imagens ocupam toda a folha com redimensionamento proporcional, e PDFs usam o visualizador do navegador. A navegação funciona por botões, teclado, toque e efeito de virada de folha.

## Estrutura

- `index.html`: página do leitor.
- `style.css`: identidade visual e animação 3D.
- `app.js`: capa, carregamento dos PDFs e navegação.
- `content/`: PDFs e cadastro das páginas.
- `assets/logo.svg`: símbolo provisório, substituível pelo símbolo oficial.
