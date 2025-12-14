# Proyecto de gestión de personas

Aplicación web construida con Angular y TypeScript que consume una API REST simulada con JSON Server. Permite realizar operaciones CRUD sobre una entidad `persona` y cuenta con autenticación simple basada en un token JWT mockeado.

## Características principales

- Pantalla de login con formularios reactivos y persistencia del token en `localStorage`.
- Protección de rutas mediante `AuthGuard` y agregado de cabecera `Authorization` con interceptor HTTP.
- Listado ordenable de personas usando Angular Material (`MatTable`).
- Formularios reactivos para crear y editar registros, con validaciones y feedback visual.
- Eliminación directa de registros desde la tabla.

## Tecnologías

- Angular 21 + Standalone Components
- TypeScript
- Angular Material
- JSON Server (API REST mock)
- RxJS

## Requisitos previos

- Node.js 18 o superior
- npm 10 (instalado con Node.js)

## Configuración

La URL de la API mock (`http://localhost:3000/personas`) está declarada en `src/app/services/person.service.ts`. Ajusta ese valor si ejecutas el backend en otra dirección o puerto.

## Puesta en marcha

Instalar dependencias:

```bash
npm install
```

Levantar la API mock con JSON Server (puerto 3000 por defecto):

```bash
npm run start:api
```

En otra terminal, iniciar la aplicación Angular (puerto 4200 por defecto):

```bash
npm start
```

Acceder a `http://localhost:4200/` y autenticarse con cualquier par usuario/contraseña (el backend devuelve un token mockeado).

## Scripts útiles

- `npm run start:api`: inicia JSON Server leyendo `src/db.json`.
- `npm start`: levanta el frontend en modo desarrollo.
- `npm run build`: genera la compilación optimizada.
- `npm test`: ejecuta las pruebas unitarias configuradas.

## Estructura relevante

- `src/app/components/login`: pantalla de autenticación.
- `src/app/components/home`: tablero principal con tabla y formulario CRUD.
- `src/app/services`: servicios para autenticación y consumo de la API.
- `src/app/guards/auth.guard.ts`: protección de rutas.
- `src/app/interceptors/auth.interceptor.ts`: inyección automática del token JWT.
