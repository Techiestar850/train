// script.js
// Fetches david-akimara-portfolio.yml, parses it with js-yaml (loaded in index.html),
// and renders every section of the page from that data.
//
// NOTE: fetch() cannot read local files over the file:// protocol in most
// browsers. Serve this folder over http (e.g. `python3 -m http.server`,
// or VS Code's "Live Server") and open http://localhost:PORT/index.html.

const DATA_URL = "david-akimara-portfolio.yml";

async function loadPortfolio() {
  const loadMsg = document.getElementById("loadMsg");
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Could not fetch ${DATA_URL} (${res.status})`);
    const rawText = await res.text();
    const data = jsyaml.load(rawText);

    render(data);
    loadMsg.hidden = true;
  } catch (err) {
    loadMsg.textContent =
      "Couldn't load portfolio content: " + err.message +
      ". If you opened this file directly (file://), run a local server " +
      "instead — e.g. `python3 -m http.server` — then open it via http://localhost.";
    loadMsg.classList.add("error");
    console.error(err);
  }
}

function render(data) {
  renderHeader(data);
  renderNav(data.nav);
  renderHero(data.hero);
  renderAbout(data);
  renderFocus(data.focus_areas);
  renderWork(data.work);
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data);
  revealSections();
}

function renderHeader(data) {
  document.getElementById("siteMonogram").textContent = data.site.monogram || "";
  document.getElementById("siteName").textContent = data.site.name || "";
  document.getElementById("aboutMonogram").textContent = data.site.monogram || "";
  document.title = data.site.title || data.site.name || "Portfolio";
}

function renderNav(navItems = []) {
  const list = document.getElementById("navList");
  list.innerHTML = "";
  navItems.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    li.appendChild(a);
    list.appendChild(li);
  });
}

function renderHero(hero = {}) {
  document.getElementById("heroEyebrow").textContent = hero.eyebrow || "";
  document.getElementById("heroHeadline").textContent = hero.headline || "";
  document.getElementById("heroLede").textContent = (hero.lede || "").trim();
  document.getElementById("diagramCaption").textContent = hero.diagram_caption || "";

  const actions = document.getElementById("heroActions");
  actions.innerHTML = "";
  (hero.actions || []).forEach((action) => {
    const a = document.createElement("a");
    a.href = action.href;
    a.textContent = action.label;
    a.className = "btn" + (action.style === "solid" ? " solid" : "");
    actions.appendChild(a);
  });
}

function renderAbout(data) {
  const container = document.getElementById("aboutText");
  container.innerHTML = "";
  (data.about?.paragraphs || []).forEach((text, i) => {
    const p = document.createElement("p");
    p.textContent = text.trim();
    if (i === 0) {
      // bold the name at the start of the first paragraph, if present
      const name = data.site?.name;
      if (name && text.trim().startsWith(name)) {
        p.innerHTML = `<strong>${name}</strong>${text.trim().slice(name.length)}`;
      }
    }
    container.appendChild(p);
  });
}

function renderFocus(areas = []) {
  const container = document.getElementById("specimens");
  container.innerHTML = "";
  areas.forEach((area) => {
    const div = document.createElement("div");
    div.className = "specimen";
    div.innerHTML = `
      <div class="tag">${escapeHtml(area.tag)}</div>
      <h3>${escapeHtml(area.title)}</h3>
      <p>${escapeHtml((area.description || "").trim())}</p>
    `;
    container.appendChild(div);
  });
}

function renderWork(items = []) {
  const container = document.getElementById("cases");
  container.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "case";
    const tags = (item.tags || [])
      .map((t) => `<span>${escapeHtml(t)}</span>`)
      .join("");
    div.innerHTML = `
      <div class="when">${escapeHtml(item.when)}</div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml((item.description || "").trim())}</p>
        <div class="tags">${tags}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderEducation(items = []) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "t-item";
    div.innerHTML = `
      <div class="when">${escapeHtml(item.when)}</div>
      <h3>${escapeHtml(item.institution)}</h3>
      <p>${escapeHtml((item.description || "").trim())}</p>
    `;
    container.appendChild(div);
  });
}

function renderContact(contact = {}) {
  document.getElementById("contactHeading").textContent = contact.heading || "";
  document.getElementById("contactLede").textContent = (contact.lede || "").trim();

  const list = document.getElementById("contactList");
  list.innerHTML = "";
  (contact.details || []).forEach((detail) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.className = "k";
    label.textContent = detail.label;
    li.appendChild(label);

    if (detail.href) {
      const a = document.createElement("a");
      a.href = detail.href;
      a.textContent = detail.value;
      li.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.textContent = detail.value;
      li.appendChild(span);
    }
    list.appendChild(li);
  });
}

function renderFooter(data) {
  document.getElementById("footerName").textContent = data.site?.name || "";
  document.getElementById("footerNote").textContent = data.footer?.note || "";
  document.getElementById("year").textContent = new Date().getFullYear();
}

function revealSections() {
  document
    .querySelectorAll("main section, footer")
    .forEach((el) => el.removeAttribute("hidden"));
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadPortfolio);
