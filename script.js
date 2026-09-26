// script.js
// Loads david-akimara-portfolio.yml and fills in index.html.
// Requires js-yaml (loaded via <script> tag in index.html) to parse YAML in the browser.

const YML_PATH = 'david-akimara-portfolio.yml';

document.getElementById('year').textContent = new Date().getFullYear();

fetch(YML_PATH)
  .then((res) => {
    if (!res.ok) throw new Error(`Could not fetch ${YML_PATH} (${res.status})`);
    return res.text();
  })
  .then((text) => {
    const data = jsyaml.load(text);
    render(data);
  })
  .catch((err) => {
    console.error(err);
    document.getElementById('load-error').style.display = 'block';
  });

function render(data) {
  renderSite(data.site);
  renderNav(data.nav);
  renderHero(data.hero);
  renderAbout(data.about, data.site);
  renderFocusAreas(data.focus_areas);
  renderWork(data.work);
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data.footer, data.site);
}

function renderSite(site) {
  if (!site) return;
  document.getElementById('page-title').textContent = site.title || site.name || '';
  document.getElementById('mark').textContent = site.monogram || '';
  document.getElementById('nav-name').textContent = site.name || '';
}

function renderNav(navItems) {
  const list = document.getElementById('nav-list');
  list.innerHTML = (navItems || [])
    .map((item) => `<li><a href="${escapeAttr(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join('');
}

function renderHero(hero) {
  if (!hero) return;
  document.getElementById('hero-eyebrow').textContent = hero.eyebrow || '';
  document.getElementById('hero-headline').textContent = hero.headline || '';
  document.getElementById('hero-lede').textContent = hero.lede || '';
  document.getElementById('diagram-caption').textContent = hero.diagram_caption || '';

  const actions = document.getElementById('hero-actions');
  actions.innerHTML = (hero.actions || [])
    .map((a) => {
      const cls = a.style === 'solid' ? 'btn solid' : 'btn';
      return `<a class="${cls}" href="${escapeAttr(a.href)}">${escapeHtml(a.label)}</a>`;
    })
    .join('');
}

function renderAbout(about, site) {
  document.getElementById('portrait').textContent = (site && site.monogram) || '';
  const container = document.getElementById('about-text');
  const paragraphs = (about && about.paragraphs) || [];
  container.innerHTML = paragraphs
    .map((p, i) => `<p>${i === 0 ? boldFirstName(p, site && site.name) : escapeHtml(p)}</p>`)
    .join('');
}

// Bold the person's name if it opens the first paragraph, otherwise just escape the text.
function boldFirstName(paragraph, name) {
  const escaped = escapeHtml(paragraph);
  if (name && escaped.startsWith(escapeHtml(name))) {
    return `<strong>${escapeHtml(name)}</strong>${escaped.slice(escapeHtml(name).length)}`;
  }
  return escaped;
}

function renderFocusAreas(items) {
  const container = document.getElementById('specimens');
  container.innerHTML = (items || [])
    .map(
      (item) => `
    <div class="specimen">
      <div class="tag">${escapeHtml(item.tag)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>`
    )
    .join('');
}

function renderWork(items) {
  const container = document.getElementById('cases');
  container.innerHTML = (items || [])
    .map(
      (item) => `
    <div class="case">
      <div class="when">${escapeHtml(item.when)}</div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="tags">${(item.tags || []).map((t) => `<span>${escapeHtml(t)}</span>`).join('')}</div>
      </div>
    </div>`
    )
    .join('');
}

function renderEducation(items) {
  const container = document.getElementById('timeline');
  container.innerHTML = (items || [])
    .map(
      (item) => `
    <div class="t-item">
      <div class="when">${escapeHtml(item.when)}</div>
      <h3>${escapeHtml(item.institution)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>`
    )
    .join('');
}

function renderContact(contact) {
  if (!contact) return;
  document.getElementById('contact-heading').textContent = contact.heading || '';
  document.getElementById('contact-lede').textContent = contact.lede || '';

  const list = document.getElementById('contact-list');
  list.innerHTML = (contact.details || [])
    .map((d) => {
      const value = d.href
        ? `<a href="${escapeAttr(d.href)}">${escapeHtml(d.value)}</a>`
        : `<span>${escapeHtml(d.value)}</span>`;
      return `<li><span class="k">${escapeHtml(d.label)}</span>${value}</li>`;
    })
    .join('');
}

function renderFooter(footer, site) {
  document.getElementById('footer-name').textContent = (site && site.name) || '';
  document.getElementById('footer-note').textContent = (footer && footer.note) || '';
}

// --- small helpers to keep text from yml out of the HTML parser's way ---
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
