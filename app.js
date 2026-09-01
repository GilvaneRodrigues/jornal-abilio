const paper = document.querySelector("#paper");
const loading = document.querySelector("#loading");
const status = document.querySelector("#readerStatus");
const pageNumber = document.querySelector("#pageNumber");
const pageTotal = document.querySelector("#pageTotal");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const paperTitle = document.querySelector("#paperTitle");
const classMenu = document.querySelector("#classMenu");
const groups = window.JOURNAL_GROUPS || [{ id: "1A", label: "1A", title: "Turma 1A", pages: window.JOURNAL_PAGES || [] }];
let currentGroupIndex = 0;
let currentPage = 0;
let isTurning = false;
let touchStartX = null;

function getCurrentGroup() {
  return groups[currentGroupIndex];
}

function getCurrentPages() {
  return getCurrentGroup().pages;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function renderClassMenu() {
  classMenu.innerHTML = groups
    .map(
      (group, index) => `
        <button
          class="class-menu-item ${index === currentGroupIndex ? "active" : ""}"
          type="button"
          data-group-index="${index}"
          aria-pressed="${index === currentGroupIndex}"
        >
          ${group.label}
        </button>
      `
    )
    .join("");

  classMenu.querySelectorAll(".class-menu-item").forEach((button) => {
    button.addEventListener("click", () => {
      const targetIndex = Number(button.dataset.groupIndex);
      if (Number.isNaN(targetIndex) || targetIndex === currentGroupIndex) return;
      currentGroupIndex = targetIndex;
      currentPage = 0;
      loadPages();
    });
  });
}

function updateControls() {
  const pages = getCurrentPages();
  pageNumber.textContent = String(currentPage + 1);
  pageTotal.textContent = String(pages.length + 1);
  previousButton.disabled = currentPage === 0 || isTurning;
  nextButton.disabled = currentPage === pages.length || isTurning;
  status.textContent = currentPage === 0 ? `Capa da ${getCurrentGroup().title}` : pages[currentPage - 1].title;
}

function updatePageStack() {
  [...paper.children].forEach((page, index) => {
    page.classList.toggle("page-visible", index === currentPage);
    page.classList.toggle("page-hidden", index !== currentPage);
    page.style.zIndex = index === currentPage ? 2 : 1;
  });
}

function makeCover() {
  const cover = document.createElement("article");
  cover.className = "page cover";
  const currentGroup = getCurrentGroup();
  cover.innerHTML = `
    <div class="cover-top">
      <img class="cover-logo" src="assets/logo.svg" alt="">
      <div>
        <p class="cover-kicker">Publicações</p>
        <p class="cover-kicker">${currentGroup.title}</p>
      </div>
    </div>
    <div>
      <p class="cover-kicker">Colégio Estadual</p>
      <h2 class="cover-title">O Abílio <em>em foco</em></h2>
      <div class="cover-rule"></div>
      <p class="cover-description">Notícias, projetos e histórias da turma ${currentGroup.label}.</p>
    </div>
    <div class="cover-footer"><span>Cleve­lândia · Paraná</span><strong>Jornal digital</strong></div>`;
  return cover;
}

function renderPage(entry) {
  const wrapper = document.createElement("article");
  wrapper.className = "page";
  wrapper.setAttribute("aria-label", entry.title);
  if (entry.type === "image") {
    wrapper.innerHTML = `<img class="page-image" src="${entry.file}" alt="${entry.title}">
      <div class="missing-page"><strong>${entry.title}</strong><span>Adicione este arquivo em content/</span></div>`;
    const image = wrapper.querySelector(".page-image");
    image.addEventListener("error", () => wrapper.classList.add("image-missing"));
  } else {
    wrapper.innerHTML = `<object class="pdf-viewer" data="${entry.file}" type="application/pdf" aria-label="${entry.title}">
      <a href="${entry.file}">Abrir ${entry.title}</a>
    </object>`;
  }
  return wrapper;
}

function loadPages() {
  const pages = getCurrentPages();
  const currentGroup = getCurrentGroup();
  paperTitle.textContent = currentGroup.title;
  paper.innerHTML = "";
  paper.appendChild(makeCover());
  for (const entry of pages) {
    paper.appendChild(renderPage(entry));
  }
  loading.classList.add("hidden");
  updatePageStack();
  updateControls();
  renderClassMenu();
}

function goTo(target) {
  const pages = getCurrentPages();
  if (isTurning || target < 0 || target > pages.length || target === currentPage) return;
  isTurning = true;
  const step = target > currentPage ? 1 : -1;
  const turningPage = paper.children[currentPage];
  const destinationPage = paper.children[currentPage + step];
  const direction = step > 0 ? "turning-next" : "turning-previous";
  destinationPage.classList.remove("page-hidden");
  destinationPage.classList.add("page-visible");
  destinationPage.style.zIndex = 1;
  turningPage.style.zIndex = 2;
  turningPage.classList.add(direction);
  const finishTurn = (event) => {
    if (event.propertyName !== "transform") return;
    turningPage.removeEventListener("transitionend", finishTurn);
    turningPage.classList.remove(direction);
    turningPage.classList.add("page-hidden");
    turningPage.classList.remove("page-visible");
    currentPage += step;
    isTurning = false;
    updatePageStack();
    updateControls();
    if (currentPage !== target) goTo(target);
  };
  turningPage.addEventListener("transitionend", finishTurn);
  updateControls();
}

previousButton.addEventListener("click", () => goTo(currentPage - 1));
nextButton.addEventListener("click", () => goTo(currentPage + 1));
document.querySelector("#firstButton").addEventListener("click", () => goTo(0));
document.querySelector("#lastButton").addEventListener("click", () => goTo(getCurrentPages().length));
document.querySelector("#fullscreenButton").addEventListener("click", () => document.documentElement.requestFullscreen?.());
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goTo(currentPage + 1);
  if (event.key === "ArrowLeft") goTo(currentPage - 1);
  if (event.key === "Home") goTo(0);
  if (event.key === "End") goTo(getCurrentPages().length);
});
paper.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
paper.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) goTo(currentPage + (distance < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

document.querySelector("#editionDate").textContent = formatDate(new Date());
renderClassMenu();
loadPages();
