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
const SUPABASE_URL = 'https://xybtjxattrlmtofcqxqu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnRqeGF0dHJsbXRvZmNxeHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NjY2MDEsImV4cCI6MjEwMDM0MjYwMX0.VhO1_ioud22Ad74cREthos_v4gYTH9w3mjFe-b7tmIg';
