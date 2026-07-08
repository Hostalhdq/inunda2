// Login de colaboradores — valida contra la Google Sheet a través de Apps Script.
(function () {
  const form = document.getElementById("login-form");
  if (!form) return;

  const errorBox = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? '<span class="spinner"></span> Verificando...'
      : "Ingresar";
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add("show");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("show");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      showError("Completa usuario y contraseña.");
      return;
    }

    const url = window.SITE_CONFIG.APPS_SCRIPT_URL;
    if (!url || url.includes("PEGA_AQUI")) {
      showError(
        "El sitio aún no está conectado a Google Sheets. Configura APPS_SCRIPT_URL en assets/js/config.js"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "login", username, password }),
      });
      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem(
          "collao_user",
          JSON.stringify({ username: data.username || username, name: data.name || username })
        );
        window.location.href = "dashboard.html";
      } else {
        showError(data.message || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      showError("No se pudo contactar el servicio de login. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });
})();

// Utilidad compartida: exige sesión activa en páginas protegidas.
function requireSession() {
  const raw = sessionStorage.getItem("collao_user");
  if (!raw) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(raw);
}

function logout() {
  sessionStorage.removeItem("collao_user");
  window.location.href = "index.html";
}
