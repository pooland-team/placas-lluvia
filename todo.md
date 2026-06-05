# Placas por Lluvia — TODO

## Base de datos y esquema
- [x] Tabla `plates` (placas reportadas: perdidas y encontradas)
- [x] Tabla `messages` (mensajería interna entre usuarios)
- [x] Tabla `conversations` (hilo de conversación entre dueño y quien encontró)
- [x] Migración SQL aplicada y verificada

## Backend (tRPC)
- [x] Procedimiento: crear reporte de placa perdida
- [x] Procedimiento: crear reporte de placa encontrada (con ubicación aproximada)
- [x] Procedimiento: listar placas encontradas (público)
- [x] Procedimiento: buscar placa por número (cruce perdida/encontrada)
- [x] Procedimiento: subida de foto a S3 (upload)
- [x] Procedimiento: iniciar conversación / contactar al dueño
- [x] Procedimiento: enviar mensaje interno
- [x] Procedimiento: listar mensajes de una conversación
- [x] Procedimiento: listar conversaciones del usuario
- [x] Notificación al dueño cuando se reporta su placa como encontrada
- [x] Mis reportes: listar placas propias del usuario autenticado

## Frontend — Páginas
- [x] Landing page elegante con CTA de reporte y búsqueda
- [x] Página de listado público de placas encontradas
- [x] Página de búsqueda de placas por número
- [x] Página de detalle de placa (con botón de contacto seguro)
- [x] Formulario: reportar placa perdida (número, descripción, fecha, foto)
- [x] Formulario: reportar placa encontrada (número, descripción, fecha, foto, ubicación)
- [x] Página de mensajería interna (lista de conversaciones + chat)
- [x] Página de mis reportes (placas propias del usuario)
- [x] Página de perfil / autenticación

## PWA y experiencia móvil
- [x] manifest.json con nombre, íconos y colores
- [x] Meta tags para PWA en index.html
- [x] Diseño responsive mobile-first en todas las páginas
- [x] Navegación inferior para móvil

## Diseño y UX
- [x] Paleta de colores elegante (fondo oscuro/neutro, acentos dorados o azul profundo)
- [x] Tipografía limpia con Google Fonts
- [x] Espaciado generoso y componentes refinados
- [x] Animaciones sutiles en transiciones
- [x] Estados de carga, vacío y error en todas las vistas
- [x] No exponer datos personales en ningún flujo de contacto

## Tests
- [x] Test: crear y buscar placa
- [x] Test: enviar mensaje interno

## Cambios v2 — Estado mexicano y sin descripción
- [x] Migración SQL: eliminar columna `description`, renombrar `locationApprox` a `estadoPlaca`
- [x] Actualizar `drizzle/schema.ts`: campo `estadoPlaca` (varchar), sin `description`
- [x] Actualizar `server/db.ts`: quitar referencias a `description` y `locationApprox`
- [x] Actualizar `server/routers.ts`: inputs/outputs sin `description`, con `estadoPlaca`
- [x] Crear constante compartida con las 32 entidades federativas de México
- [x] Actualizar `PlateReportForm.tsx`: selector de estado, sin campo descripción
- [x] Actualizar `FoundPlates.tsx`: mostrar estado en lugar de locationApprox
- [x] Actualizar `Search.tsx`: mostrar estado
- [x] Actualizar `PlateDetail.tsx`: mostrar estado, sin descripción
- [x] Actualizar `MyPlates.tsx`: mostrar estado
- [x] Actualizar tests para reflejar nuevo esquema
