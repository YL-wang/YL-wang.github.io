history.scrollRestoration = "manual";

async function loadSections() {
  const pages = Array.from(document.querySelectorAll(".page"));

  await Promise.all(
    pages.map(async (page) => {
      const src = page.dataset.src;
      if (!src) return;

      const response = await fetch(src);
      if (!response.ok) {
        page.innerHTML = `<div class="card"><p>Failed to load ${src}</p></div>`;
        return;
      }

      page.innerHTML = await response.text();
    })
  );

  initNavigation();
}

function initNavigation() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const navBtns = Array.from(document.querySelectorAll(".nav-btn"));
  const brand = document.querySelector(".brand");
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  function show(id) {
    pages.forEach(p => p.classList.toggle("is-visible", p.id === id));
    navBtns.forEach(b => b.classList.toggle("is-active", b.dataset.nav === id));

    if (nav) {
      nav.classList.remove("is-open");
    }

    if (id === "home") {
      history.replaceState(null, "", location.pathname);
    } else {
      history.replaceState(null, "", "#" + id);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => show(btn.dataset.nav));
  });

  if (brand) {
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      show("home");
    });
  }

  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  }

  const initial = location.hash ? location.hash.replace("#", "") : "home";
  if (pages.some(p => p.id === initial)) {
    show(initial);
  } else {
    show("home");
  }

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

loadSections();
