# Collao Alerta — sitio web sobre las inundaciones de Collao

Sitio estático (blog moderno) sobre las inundaciones del sector Collao. Los colaboradores
inician sesión y suben fotos + título + descripción, que quedan visibles y descargables
para todos los visitantes.

## Arquitectura

- **Frontend**: HTML/CSS/JS puro, sin build, pensado para GitHub Pages.
- **Login de colaboradores**: valida usuario/contraseña contra una **Google Sheet**, a través
  de un pequeño backend gratuito hecho con **Google Apps Script** (`google-apps-script/Code.gs`).
- **Publicaciones (fotos + texto)**: se guardan directo en este repositorio de **GitHub**
  (carpeta `data/images/` para las fotos y `data/posts/index.json` como índice), usando la
  API de GitHub desde el navegador del colaborador con su propio token personal.

## 1. Publicar el sitio en GitHub Pages

```bash
cd collao-inundaciones
git init
git add .
git commit -m "Sitio inicial Collao Alerta"
```

Luego en GitHub.com crea un repositorio vacío (por ejemplo `collao-inundaciones`), y:

```bash
git remote add origin https://github.com/TU_USUARIO/collao-inundaciones.git
git branch -M main
git push -u origin main
```

En GitHub: **Settings → Pages → Deploy from a branch → main / (root)**. El sitio quedará en
`https://TU_USUARIO.github.io/collao-inundaciones/`.

## 2. Configurar `assets/js/config.js`

Edita:

```js
GITHUB_OWNER: "TU_USUARIO_GITHUB",
GITHUB_REPO: "collao-inundaciones",
GITHUB_BRANCH: "main",
APPS_SCRIPT_URL: "...", // paso 3
```

## 3. Crear la Google Sheet + Apps Script (login)

1. Crea una Google Sheet nueva. En la primera hoja pon los encabezados en la fila 1:
   `usuario | contrasena | nombre`.
2. Copia los 10 usuarios de ejemplo desde `CREDENCIALES-COLABORADORES.md` (no se sube a GitHub).
3. En la Sheet: **Extensiones → Apps Script**. Borra el contenido y pega
   `google-apps-script/Code.gs`.
4. Revisa que `SHEET_NAME` en el script coincida con el nombre de tu pestaña (por defecto "Hoja 1").
5. **Implementar → Nueva implementación → tipo "Aplicación web"**:
   - Ejecutar como: tu cuenta
   - Acceso: cualquier usuario
6. Copia la URL entregada y pégala en `APPS_SCRIPT_URL` en `config.js`.

Puedes agregar, editar o borrar colaboradores directamente en la Sheet en cualquier momento;
no hace falta redesplegar nada.

## 4. Token de GitHub para cada colaborador

Cada colaborador que vaya a publicar necesita su propio **Personal Access Token** de GitHub
con permiso de escritura sobre este repo:

- GitHub → Settings → Developer settings → **Fine-grained tokens** → New token
- Repository access: solo este repositorio
- Permissions: **Contents → Read and write**

El token se pega una sola vez en el panel de colaborador (`dashboard.html`) y queda guardado
solo en su navegador (si marca "Recordar token"). Nunca se sube al repo ni se comparte.

## 5. Contenido a personalizar

- `index.html`: textos de la sección "¿Por qué se inunda Collao?", estadísticas del hero.
- `CREDENCIALES-COLABORADORES.md`: nombres reales y contraseñas de tus 10 colaboradores.

## ⚠️ Límites de seguridad a tener claros

- El login protege el acceso al panel de publicación, pero como el sitio es 100% estático,
  alguien con conocimientos técnicos podría inspeccionar el código y evitarlo. No lo uses
  para información sensible.
- Las contraseñas viven en la Google Sheet en texto plano; solo el dueño de la cuenta de
  Google puede verla directamente (el Apps Script las valida sin exponer la hoja al público).
- Cada colaborador con token de escritura puede modificar cualquier archivo del repo, no solo
  crear posts. Si necesitas más control de acceso, el siguiente paso sería un backend real.
