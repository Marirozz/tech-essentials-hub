# Tech Essentials Hub

## Novedad de esta versión

El panel administrativo ahora incluye:

- Productos: biblioteca central reutilizable.
- Guías: contenido editorial vinculado a productos existentes.
- Selección de productos por guía.
- Orden, distinción y nota específica para cada producto dentro de una guía.

## Actualizar una instalación existente

1. Copia los archivos de esta versión sobre el proyecto.
2. Conserva tu `.env.local`.
3. En Supabase SQL Editor ejecuta `supabase/guides-migration.sql`.
4. Ejecuta:

```bash
npm install
npm run build
```

5. Sube los cambios a GitHub.
6. Vercel desplegará la nueva versión.

## Flujo de contenido

1. Crea productos en `/admin`.
2. Ve a `/admin/guias`.
3. Crea una guía.
4. Selecciona los productos que aparecerán.
5. Publica la guía.

Un producto puede utilizarse en varias guías y se actualiza desde un único lugar.
