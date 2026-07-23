# Collao Alerta — Prevención Meteorológica e Hidrológica

Dashboard comunitario de prevención de inundaciones para el sector Collao - Nonguén,
Concepción. Sitio estático de un solo archivo (`index.html`), sin build, pensado para
GitHub Pages.

## Qué incluye

- **Telemetría en vivo**: lluvia, viento y ráfagas desde la API pública de
  [Open-Meteo](https://open-meteo.com/) para las coordenadas de Concepción.
- **Saturación del suelo**: estimada con un algoritmo simple sobre la lluvia acumulada
  (no es una medición real).
- **Nivel del Estero Nonguén**: **simulado** — la DGA (MOP) no tiene una API pública de
  baja latencia para este tramo. Hay un panel de calibración en la pestaña "Real vs
  Simulación" para probar cómo reacciona el sitio ante distintos niveles.
- **Mapa comunitario** (Leaflet): reportes geolocalizados, filtrables por categoría.
- **Feed de reportes ciudadanos** con formulario de 3 clics para reportar.
- **Protocolo de emergencia**: teléfonos útiles y checklist antes/durante/después de
  lluvias intensas.

Los reportes ciudadanos y las confirmaciones viven solo en memoria del navegador
(se pierden al recargar la página) — todavía no hay backend.

## Publicar en GitHub Pages

```bash
cd collao-inundaciones
git push -u origin main
```

En GitHub: **Settings → Pages → Deploy from a branch → main / (root)**. El sitio queda en
`https://hostalhdq.github.io/inunda2/`.

## Pendiente para producción real

1. **Persistencia de reportes**: conectar una base de datos (ej. Supabase/PostGIS) para
   que los reportes se compartan entre todos los visitantes en vez de vivir solo en la
   sesión local. Ver la pestaña "Real vs Simulación" dentro del sitio para el esquema SQL
   sugerido.
2. **Nivel real del Estero Nonguén**: reemplazar la simulación por un sensor IoT
   (ultrasónico LoRaWAN) o un webhook si la DGA llega a exponer uno.
