# Santuario Corre 5K & 10K 2026

Este proyecto es una aplicación web para la gestión de inscripciones de la carrera "Santuario Corre 5K & 10K 2026". Está construido utilizando **Angular 17** con **Angular SSR (Server-Side Rendering)** y un backend integrado en **Node.js/Express** que se conecta a **MongoDB**.

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- MongoDB (Configurado en el archivo `server.ts` o mediante variable de entorno `MONGO_URI`)

## Desarrollo Local

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Construcción y Ejecución (SSR)
Para correr la aplicación con todas sus funcionalidades (incluyendo la API y el renderizado en el servidor), debes construir el proyecto y luego ejecutar el servidor:

```bash
# Construir el proyecto
ng build

# Ejecutar el servidor SSR localmente
npm run serve:ssr:carrera-santuario
```

La aplicación estará disponible en `http://localhost:4000`.

## Scripts Disponibles

- `ng serve`: Lanza el servidor de desarrollo de Angular (solo frontend, sin SSR/API completa).
- `ng build`: Compila la aplicación para producción.
- `npm run serve:ssr:carrera-santuario`: Inicia el servidor SSR en el puerto 4000.