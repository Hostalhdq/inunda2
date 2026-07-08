// Renderiza el feed público de publicaciones leyendo data/posts/index.json
(async function () {
  const feedEl = document.getElementById("feed");
  if (!feedEl) return;

  try {
    const res = await fetch("data/posts/index.json?_=" + Date.now());
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      feedEl.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          Todavía no hay publicaciones de colaboradores.
          <br>Cuando alguien suba una foto y su reporte, aparecerá aquí.
        </div>`;
      return;
    }

    posts
      .slice()
      .reverse()
      .forEach((post, i) => {
        const card = document.createElement("article");
        card.className = "card";
        card.style.animationDelay = (i * 0.05) + "s";

        const initials = (post.author || "?").slice(0, 2).toUpperCase();
        const date = post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "";

        card.innerHTML = `
          <div class="img-wrap">
            <img src="${post.imagePath}" alt="${escapeHtml(post.title)}" loading="lazy">
          </div>
          <div class="card-body">
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.description)}</p>
            <div class="card-meta">
              <span class="author"><span class="avatar">${initials}</span> ${escapeHtml(post.author || "Colaborador")}</span>
              <span>${date}</span>
            </div>
            <div style="margin-top:10px;">
              <a class="dl-link" href="${post.imagePath}" download target="_blank" rel="noopener">Descargar imagen ↓</a>
            </div>
          </div>
        `;
        feedEl.appendChild(card);
      });
  } catch (err) {
    feedEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No se pudo cargar el feed en este momento.</div>`;
    console.error(err);
  }
})();

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
