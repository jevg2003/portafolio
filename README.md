# Portafolio frontend en Astro

## Resumen

Versión en Astro del portafolio de Jorge Velásquez. Presenta repositorios de GitHub, fichas de proyectos y un grafo interactivo de habilidades.

## Qué incluye

- Cuadrícula de proyectos alimentada por [el servicio de GitHub](src/features/projects/services/github.ts).
- Rutas de detalle en [src/pages/project](src/pages/project) y un grafo en [src/features/skills](src/features/skills).
- Interfaz oscura con Astro, Tailwind CSS, GSAP y Lenis.

## Desarrollo local

Usa Node.js 22.12 o posterior.

```bash
pnpm install
pnpm dev
```

Para generar el sitio, ejecuta `pnpm build`.

## English summary

An Astro version of Jorge Velásquez's portfolio. It presents GitHub repositories, project detail pages, and an interactive skills graph.
