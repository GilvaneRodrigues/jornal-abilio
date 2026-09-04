const paper = document.querySelector("#paper");
const loading = document.querySelector("#loading");
const status = document.querySelector("#readerStatus");
const pageNumber = document.querySelector("#pageNumber");
const pageTotal = document.querySelector("#pageTotal");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const paperTitle = document.querySelector("#paperTitle");
const intro = document.querySelector("#intro");
const editionGrid = document.querySelector("#editionGrid");
const introCount = document.querySelector("#introCount");
const exploreButton = document.querySelector("#exploreButton");
const homeButton = document.querySelector("#homeButton");
const brand = document.querySelector(".brand");
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

function renderIntro() {
  introCount.textContent = `${groups.length} edições disponíveis`;
  editionGrid.innerHTML = groups.map((group, index) => {
    const firstPage = group.pages[0];
    return `
      <button class="edition-card ${index === 0 ? "featured" : ""}" type="button" data-intro-group-index="${index}">
        <span class="edition-card-image" style="background-image: url('${firstPage?.file || "assets/logo.svg"}')"></span>
        <span class="edition-card-shade"></span>
        <span class="edition-card-body">
          <span class="edition-card-number">0${index + 1}</span>
          <strong>${group.label}</strong>
          <span class="edition-card-open">Abrir edição <b aria-hidden="true">↗</b></span>
        </span>
      </button>`;
  }).join("");

  editionGrid.querySelectorAll("[data-intro-group-index]").forEach((button) => {
    button.addEventListener("click", () => openReader(Number(button.dataset.introGroupIndex), true));
  });
}

function openReader(groupIndex = 0, openFirstImage = false) {
  if (!Number.isInteger(groupIndex) || !groups[groupIndex]) return;
  currentGroupIndex = groupIndex;
  currentPage = openFirstImage && groups[groupIndex].pages.length > 0 ? 1 : 0;
  intro.classList.add("intro-hidden");
  document.body.classList.add("reader-open");
  loadPages();
}

function showIntro(event) {
  event?.preventDefault();
  intro.classList.remove("intro-hidden");
  document.body.classList.remove("reader-open");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
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
}

function goTo(target) {
  const pages = getCurrentPages();
  if (isTurning || target < 0 || target > pages.length || target === currentPage) return;

  const step = target > currentPage ? 1 : -1;
  const turningPage = paper.children[currentPage];
  const destinationPage = paper.children[target];

  if (!turningPage || !destinationPage) return;

  isTurning = true;
  updateControls();

  const direction = step > 0 ? "turning-next" : "turning-previous";

  turningPage.classList.remove("turning-next", "turning-previous");
  turningPage.classList.add(direction);
  turningPage.style.zIndex = 2;
  destinationPage.classList.remove("page-hidden");
  destinationPage.classList.add("page-visible");
  destinationPage.style.zIndex = 3;

  setTimeout(() => {
    turningPage.classList.remove(direction, "page-visible");
    turningPage.classList.add("page-hidden");
    destinationPage.classList.remove("page-hidden");
    destinationPage.classList.add("page-visible");

    currentPage = target;
    isTurning = false;
    updatePageStack();
    updateControls();
  }, 620);
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
exploreButton.addEventListener("click", () => openReader(0));
homeButton.addEventListener("click", showIntro);
brand.addEventListener("click", showIntro);
renderIntro();
loadPages();
