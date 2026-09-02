/*
  Organize as publicações por turma para exibir no menu lateral.
  Cada grupo representa uma opção do menu.
*/
window.JOURNAL_GROUPS = [
  {
    id: "1A",
    label: "1A",
    title: "Turma 1A",
    pages: [
      { title: "Publicação da turma 1A", file: "content/1.jpeg", type: "image" }
    ]
  },
  {
    id: "2A-2C",
    label: "Literatura - 2A",
    title: "Turma 2A",
    pages: [
      { title: "Literatura 2A", file: "content/Janaina-2a/Literatura 2a.jpeg", type: "image" },
      { title: "Literatura 2A", file: "content/Janaina-2a/Literatura1 2a.jpeg", type: "image" },
      { title: "Literatura 2A", file: "content/Janaina-2a/Literatura2 2a.jpeg", type: "image" },
      { title: "Literatura 2A", file: "content/Janaina-2a/Literatura3 2a.jpeg", type: "image" },
      { title: "Literatura 2A", file: "content/Janaina-2a/Literatura4 2a.jpeg", type: "image" }

    ]
  },
  {
    id: "2C",
    label: "Literatura - 2C",
    title: "Turma 2C",
    pages: [
      { title: "Literatura", file: "content/Fernanda/Fernanda1.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda2.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda3.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda4.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda5.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda6.jpeg", type: "image" },
      { title: "Literatura", file: "content/Fernanda/Fernanda7.jpeg", type: "image" }

    ]
  },
  {
    id: "1A",
    label: "Geografia do Paraná - 1A",
    title: "Turma 1A",
    pages: [
      { title: "Geografia do Paraná", file: "content/Sergiana/Sergiana.png", type: "image" },
      { title: "Geografia do Paraná", file: "content/Sergiana/Sergiana1.png", type: "image" },
      { title: "Geografia do Paraná", file: "content/Sergiana/Sergiana2.png", type: "image" },
      { title: "Geografia do Paraná", file: "content/Sergiana/Sergiana3.png", type: "image" }

    ]
  }
];

window.JOURNAL_PAGES = window.JOURNAL_GROUPS[0].pages;
