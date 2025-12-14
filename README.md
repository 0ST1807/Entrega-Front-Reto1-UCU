# Proyecto de "gestión de personas"

Aplicación web construida con Angular y TypeScript que consume una API REST simulada con JSON Server. Permite realizar operaciones CRUD sobre una entidad `persona` y cuenta con autenticación simple basada en un token JWT mockeado. Esta autenticación es necesaria para acceder a las funcionalidades principales de la aplicación, pero no tengo credenciales predefinidas por lo que se ingresa con cualquier usuario y contraseña.

## Características principales

- Pantalla de login desarrollada con formularios y validaciones vistas en clase.
- "Protección" de rutas mediante `AuthGuard` y `Authorization` con interceptor HTTP.
- Metodos CRUD en `PersonService` donde tambien se realiza la llamada al json server.
- Eliminación y modificación de registros desde la tabla.

## Tecnologías

- Angular + Standalone Components
- TypeScript
- Angular Material
- Angular Services
- JSON Server (API REST)


## Instrucciones para ejecutar el proyecto

Instalar dependencias (node_modules):

npm i


Levantar la API (JSON Server):

npx json-server db.json

En otra terminal, iniciar la aplicación Angular:

npm start


Acceder en el navegador web a `http://localhost:4200/` y autenticarse con cualquier par usuario/contraseña (se devuelve un token "mockeado").


## Estructura del proyecto

- `src/app/components/login`: pantalla de inicio de sesión.
- `src/app/components/home`: tablero principal con tabla y formulario CRUD.
- `src/app/services`: servicios para autenticación y consumo de la "API".
- `src/app/guards/auth.guard.ts`: protección de rutas de acuerdo con lo visto en clase.
- `src/app/interceptors/auth.interceptor.ts`: inyección del token JWT.
