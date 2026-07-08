/**
 * Collao Alerta — validación de login de colaboradores contra Google Sheets.
 *
 * CÓMO INSTALAR:
 * 1. Crea una Google Sheet nueva llamada, por ejemplo, "Collao Colaboradores".
 * 2. En la primera hoja, crea las columnas: usuario | contrasena | nombre
 *    (fila 1 = encabezados, desde la fila 2 van los datos).
 * 3. Ve a Extensiones > Apps Script, borra el contenido de Code.gs y pega este archivo completo.
 * 4. Haz clic en "Implementar" > "Nueva implementación" > tipo "Aplicación web".
 *      - Ejecutar como: Yo (tu cuenta)
 *      - Quién tiene acceso: Cualquier usuario
 * 5. Copia la URL que te entrega y pégala en assets/js/config.js como APPS_SCRIPT_URL.
 * 6. Cada vez que agregues o cambies un usuario en la Sheet, el cambio aplica al instante
 *    (no hace falta volver a implementar), a menos que hayas guardado una versión anterior fijada.
 */

const SHEET_NAME = "Hoja 1"; // Cambia esto si tu hoja tiene otro nombre.

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, message: "Solicitud inválida." });
  }

  if (payload.action === "login") {
    return handleLogin(payload.username, payload.password);
  }

  return jsonResponse({ ok: false, message: "Acción no reconocida." });
}

function handleLogin(username, password) {
  if (!username || !password) {
    return jsonResponse({ ok: false, message: "Falta usuario o contraseña." });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // data[0] son los encabezados: usuario | contrasena | nombre
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowUser = String(row[0] || "").trim();
    const rowPass = String(row[1] || "").trim();
    const rowName = String(row[2] || "").trim();

    if (rowUser.toLowerCase() === username.trim().toLowerCase() && rowPass === password) {
      return jsonResponse({ ok: true, username: rowUser, name: rowName || rowUser });
    }
  }

  return jsonResponse({ ok: false, message: "Usuario o contraseña incorrectos." });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
