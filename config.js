// Configuración de Supabase para Collao Alerta
//
// Sin esto configurado, el sitio sigue funcionando igual, pero cada reporte
// queda guardado solo en el navegador de quien lo crea (localStorage) y no
// se comparte con otros visitantes.
//
// Para activarlo:
// 1. Crea un proyecto gratuito en https://supabase.com
// 2. En el SQL Editor del proyecto, ejecuta el script de la pestaña
//    "Real vs Simulación" del sitio (tabla reportes_collao).
// 3. Ve a Project Settings -> API y copia:
//    - "Project URL"      -> pégala en SUPABASE_URL
//    - "anon public" key  -> pégala en SUPABASE_ANON_KEY
//    (la "anon" key está diseñada para exponerse en el navegador; la
//    seguridad real la dan las políticas RLS de la tabla, no el secreto de la key)
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
