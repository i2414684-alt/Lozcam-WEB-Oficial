# Prompt para el agente — Agregar "Exportar a Excel"

> Copia todo lo de abajo de la línea y pégalo a tu agente.

---

Agrega una función "Exportar a Excel" al módulo de Reportes del proyecto lozcam-web-oficial
(Next.js 16, App Router, TypeScript, Tailwind v4). Sigue EXACTAMENTE estos pasos.

## Pasos

1. Instala la dependencia (no toques otras):
   `npm install exceljs`

2. Crea estos dos archivos NUEVOS con el contenido que te entrego aparte
   (datos-demo.ts y route.ts):
   - `lib/reportes/datos-demo.ts`
   - `app/api/reportes/export/route.ts`

3. Edita SOLO `app/(dashboard)/reportes/page.tsx`: agrega este enlace en la cabecera,
   junto al botón existente de crear reporte. NO uses onClick (la página es Server Component):

```tsx
<a
  href="/api/reportes/export"
  className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
>
  Exportar a Excel
</a>
```

## REGLAS ESTRICTAS

1. Toca SOLO: `package.json` (vía npm install), los dos archivos nuevos, y `reportes/page.tsx`.
   No modifiques ningún otro archivo.
2. No cambies la lógica existente de la página de reportes (queries, tabla, columnas).
   Solo AGREGA el enlace en la cabecera.
3. No conviertas la página a Client Component ni agregues `'use client'`.
4. No alteres configs (next.config, tsconfig, tailwind, eslint) ni nada en lib/supabase, contexts, hooks.
5. Guarda los archivos en UTF-8 sin BOM.
6. Si algo te obliga a tocar un archivo fuera de la lista, DETENTE y avísame con la ruta y el motivo.

## VERIFICACIÓN

```powershell
Remove-Item -Recurse -Force .next
npm run build
```

- Si compila: arranca `npm run dev`, entra a `/reportes`, confirma que el botón
  "Exportar a Excel" descarga un .xlsx, y reporta "OK" + archivos tocados.
- Si falla: pégame el error completo y la ruta del archivo, y espera mi instrucción.
  Máximo 3 intentos de corrección dentro de los archivos permitidos.
