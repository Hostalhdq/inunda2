// Panel de colaborador — sube foto + título + descripción como commit al repo de GitHub.
(function () {
  const session = requireSession();
  if (!session) return;

  document.getElementById("dash-username").textContent = session.name || session.username;

  const tokenInput = document.getElementById("gh-token");
  const rememberBox = document.getElementById("gh-remember");
  const savedToken = localStorage.getItem("collao_gh_token");
  if (savedToken) tokenInput.value = savedToken;

  const form = document.getElementById("post-form");
  const errorBox = document.getElementById("post-error");
  const successBox = document.getElementById("post-success");
  const submitBtn = document.getElementById("post-submit");
  const fileInput = document.getElementById("post-image");
  const previewBox = document.getElementById("preview-box");
  const previewImg = document.getElementById("preview-img");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) {
      previewBox.classList.remove("show");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewBox.classList.add("show");
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("logout-btn").addEventListener("click", logout);

  function showError(msg) {
    successBox.classList.remove("show");
    errorBox.textContent = msg;
    errorBox.classList.add("show");
  }
  function showSuccess(msg) {
    errorBox.classList.remove("show");
    successBox.textContent = msg;
    successBox.classList.add("show");
  }
  function setLoading(loading, label) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? `<span class="spinner"></span> ${label}`
      : "Publicar";
  }

  // Redimensiona/comprime la imagen en el navegador antes de subirla (evita límites de tamaño de la API de GitHub).
  function resizeImage(file, maxWidth = 1400, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function base64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }
  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);
  }

  async function ghRequest(path, token, options = {}) {
    const { GITHUB_OWNER, GITHUB_REPO } = window.SITE_CONFIG;
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        ...options,
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          ...(options.headers || {}),
        },
      }
    );
    return res;
  }

  async function putFile(path, token, base64Content, message, sha) {
    const { GITHUB_BRANCH } = window.SITE_CONFIG;
    const body = {
      message,
      content: base64Content,
      branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;
    const res = await ghRequest(path, token, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Error al guardar ${path} (${res.status})`);
    }
    return res.json();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("show");
    successBox.classList.remove("show");

    const { GITHUB_OWNER, GITHUB_REPO } = window.SITE_CONFIG;
    if (!GITHUB_OWNER || GITHUB_OWNER.includes("TU_USUARIO")) {
      showError("Configura GITHUB_OWNER/GITHUB_REPO en assets/js/config.js antes de publicar.");
      return;
    }

    const token = tokenInput.value.trim();
    const title = document.getElementById("post-title").value.trim();
    const description = document.getElementById("post-description").value.trim();
    const file = fileInput.files[0];

    if (!token) return showError("Ingresa tu token personal de GitHub.");
    if (!title || !description || !file)
      return showError("Completa título, descripción e imagen.");

    if (rememberBox.checked) localStorage.setItem("collao_gh_token", token);
    else localStorage.removeItem("collao_gh_token");

    setLoading(true, "Procesando imagen...");
    try {
      const dataUrl = await resizeImage(file);
      const base64Image = dataUrl.split(",")[1];

      const id = `${Date.now()}-${slugify(title) || "post"}`;
      const imagePath = `data/images/${id}.jpg`;

      setLoading(true, "Subiendo imagen...");
      await putFile(
        imagePath,
        token,
        base64Image,
        `Colaboración: nueva imagen de ${session.name || session.username}`
      );

      setLoading(true, "Actualizando publicaciones...");
      let currentPosts = [];
      let sha;
      const indexRes = await ghRequest("data/posts/index.json", token);
      if (indexRes.status === 200) {
        const indexData = await indexRes.json();
        sha = indexData.sha;
        currentPosts = JSON.parse(base64ToUtf8(indexData.content.replace(/\n/g, "")));
      } else if (indexRes.status !== 404) {
        throw new Error("No se pudo leer data/posts/index.json");
      }

      currentPosts.push({
        id,
        title,
        description,
        imagePath,
        author: session.name || session.username,
        createdAt: new Date().toISOString(),
      });

      await putFile(
        "data/posts/index.json",
        token,
        utf8ToBase64(JSON.stringify(currentPosts, null, 2)),
        `Colaboración: publicación "${title}" de ${session.name || session.username}`,
        sha
      );

      showSuccess(
        "¡Publicado! GitHub Pages puede tardar uno o dos minutos en mostrar los cambios en el sitio público."
      );
      form.reset();
      previewBox.classList.remove("show");
    } catch (err) {
      console.error(err);
      showError(err.message || "Ocurrió un error al publicar. Revisa tu token y vuelve a intentar.");
    } finally {
      setLoading(false);
    }
  });
})();
