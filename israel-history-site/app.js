/* Renderer + interactions (vanilla JS)
   - Renders tag filters
   - Renders timeline sections
   - Search + tag filter logic
   - Accessible details/summary and alt text
*/

(function () {
  const DATA = window.ISRAEL_HISTORY_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Header info
  $("#yearPill").textContent = DATA.year;
  $("h1").textContent = DATA.eraTitle;
  $("#yearEnd").textContent = `End of ${DATA.year}`;
  $("#yearNow").textContent = new Date().getFullYear();

  // Build tag chips
  const allTags = Array.from(
    new Set(DATA.days.flatMap(d => d.events.flatMap(e => e.tags || [])))
  );
  let activeTags = new Set();
  let query = "";

  const tagRow = $("#tagRow");
  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "px-3 py-1.5 rounded-full text-sm font-medium transition bg-white/10 text-white hover:bg-white/20";
    btn.innerText = tag;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.className = "px-3 py-1.5 rounded-full text-sm font-medium transition bg-white/10 text-white hover:bg-white/20";
        btn.setAttribute("aria-pressed", "false");
      } else {
        activeTags.add(tag);
        btn.className = "px-3 py-1.5 rounded-full text-sm font-medium transition bg-cyan-400 text-black";
        btn.setAttribute("aria-pressed", "true");
      }
      render();
    });
    tagRow.appendChild(btn);
  });

  // Search
  $("#search").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    render();
  });

  // Rendering helpers
  const paletteClass = (label) => DATA.tagsPalette?.[label] || "bg-white/10";
  const timeline = $("#timeline");

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function cardForEvent(ev) {
    const card = document.createElement("article");
    card.className = "rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden shadow-card";

    const hero = document.createElement("div");
    hero.className = "relative";
    hero.innerHTML = `
      <img src="${ev.hero}" alt="" class="h-44 w-full object-cover" loading="lazy">
    `;
    if (ev.tags?.length) {
      const tagWrap = document.createElement("div");
      tagWrap.className = "absolute top-2 right-2 flex gap-2";
      ev.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${paletteClass(t)}`;
        span.textContent = t;
        tagWrap.appendChild(span);
      });
      hero.appendChild(tagWrap);
    }
    card.appendChild(hero);

    const details = document.createElement("details");
    details.open = true;

    const summary = document.createElement("summary");
    summary.className = "list-none w-full text-left p-4 flex items-start gap-3 cursor-pointer";
    summary.innerHTML = `
      <div class="flex-1">
        <h3 class="text-base font-semibold leading-snug">${ev.title}</h3>
        ${ev.subtitle ? `<p class="mt-1 text-sm text-white/80">${ev.subtitle}</p>` : ""}
      </div>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" class="ml-2 opacity-80"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
    `;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "px-4 pb-4";

    if (ev.bullets?.length) {
      const wrap = document.createElement("div");
      wrap.className = "space-y-3";
      ev.bullets.forEach((b) => {
        const row = document.createElement("div");
        row.className = "grid grid-cols-12 gap-3";
        row.innerHTML = `
          <div class="col-span-4">
            <img src="${b.image}" alt="" class="h-20 w-full rounded-lg object-cover" loading="lazy">
          </div>
          <p class="col-span-8 text-sm leading-snug text-white/90">${b.text}</p>
        `;
        wrap.appendChild(row);
      });
      body.appendChild(wrap);
    }

    if (ev.articles?.length) {
      const h = document.createElement("div");
      h.className = "mt-5";
      h.innerHTML = `<div class="text-xs tracking-widest text-cyan-300">ARTICLES</div>`;
      const ul = document.createElement("ul");
      ul.className = "mt-2 space-y-2";
      ev.articles.forEach((a) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <a href="${a.href}" class="group flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" class="opacity-70 group-hover:opacity-100"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
            <span class="underline decoration-cyan-400/50 underline-offset-2">${a.title}</span>
          </a>
        `;
        ul.appendChild(li);
      });
      h.appendChild(ul);
      body.appendChild(h);
    }

    const actions = document.createElement("div");
    actions.className = "mt-4 flex items-center gap-3 text-xs text-white/60";
    actions.innerHTML = `
      <button class="inline-flex items-center gap-1 hover:text-white" aria-label="Share"><span>Share</span></button>
      <button class="inline-flex items-center gap-1 hover:text-white" aria-label="Save"><span>Save</span></button>
    `;
    body.appendChild(actions);

    details.appendChild(body);
    details.addEventListener("toggle", () => {
      const icon = summary.querySelector("svg");
      if (details.open) {
        icon.style.transform = "rotate(0deg)";
      } else {
        icon.style.transform = "rotate(-90deg)";
      }
    });

    card.appendChild(details);
    return card;
  }

  function daySection(day) {
    const section = document.createElement("section");
    section.className = "py-4 space-y-3";
    const dividerWrap = document.createElement("div");
    dividerWrap.className = "sticky top-[64px] z-10 -mx-4";
    dividerWrap.innerHTML = `
      <div class="px-4 py-2 text-cyan-300 text-sm tracking-widest bg-black/70 backdrop-blur">${day.label}</div>
      <div class="h-px w-full bg-white/10"></div>
    `;
    section.appendChild(dividerWrap);

    if (day.tagBanner) {
      const span = document.createElement("span");
      const extra = paletteClass(day.tagBanner);
      span.className = `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${extra}`;
      span.textContent = day.tagBanner;
      const wrap = document.createElement("div");
      wrap.className = "mt-3";
      wrap.appendChild(span);
      section.appendChild(wrap);
    }

    day.events.forEach(ev => section.appendChild(cardForEvent(ev)));
    return section;
  }

  function matches(ev) {
    const text = (ev.title + " " + (ev.subtitle || "")).toLowerCase();
    const qOk = !query || text.includes(query);
    const tOk = !activeTags.size || (ev.tags || []).some(t => activeTags.has(t));
    return qOk && tOk;
  }

  function render() {
    clear(timeline);
    const filtered = DATA.days
      .map(d => ({ ...d, events: d.events.filter(matches) }))
      .filter(d => d.events.length > 0);
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "text-white/70 text-sm pt-6";
      empty.textContent = "No events match your search/filters.";
      timeline.appendChild(empty);
      return;
    }
    filtered.forEach(d => timeline.appendChild(daySection(d)));
  }

  render();
})();