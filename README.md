# Tech Essentials Hub

## Inicio local

```bash
npm install
npm run dev
```

## Activar el panel dinámico de productos

1. Crea un proyecto gratuito en Supabase.
2. Abre **SQL Editor**, pega `supabase/schema.sql` y ejecuta el script.
3. En Supabase ve a **Project Settings → API** y copia la URL, la clave anon y la clave service_role.
4. Crea `.env.local` en la raíz usando `.env.example`.
5. Define una contraseña propia en `ADMIN_PASSWORD`.
6. Reinicia `npm run dev`.
7. Abre `http://localhost:3000/admin`.

Desde el panel puedes crear, editar y eliminar productos. Los productos publicados aparecen automáticamente en la web. Mientras Supabase no esté configurado, el sitio usa los productos de ejemplo de `src/data/content.ts`.

> Nunca publiques ni compartas `SUPABASE_SERVICE_ROLE_KEY`.
