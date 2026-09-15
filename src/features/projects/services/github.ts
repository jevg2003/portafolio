import type { Project } from '../types';

const GITHUB_USERNAME = 'jevg2003';

// Fallback projects in case GitHub API is rate-limited or offline during build
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "cruz-roja-dashboard",
    title: "Cruz Roja Dashboard",
    description: "Tablero administrativo moderno desarrollado en TypeScript para la Cruz Roja, enfocado en telemetría y reportes.",
    tech: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    image: "https://api.microlink.io/?url=https%3A%2F%2Fcruz-roja-dashboard.vercel.app&screenshot=true&embed=screenshot.url",
    github: "https://github.com/jevg2003/cruz-roja-dashboard",
    live: "https://cruz-roja-dashboard.vercel.app",
    isDeployed: true,
    stars: 2,
    forks: 0,
    language: "TypeScript"
  },
  {
    id: "Aptly",
    title: "Aptly",
    description: "Aplicación móvil moderna desarrollada con React Native y Expo para conectar talento con oportunidades laborales con un solo toque.",
    tech: ["React Native", "Expo", "TypeScript", "Tailwind CSS"],
    image: "https://opengraph.githubassets.com/1/jevg2003/Aptly",
    github: "https://github.com/jevg2003/Aptly",
    live: null,
    isDeployed: false,
    stars: 1,
    forks: 0,
    language: "TypeScript"
  },
  {
    id: "appsalon",
    title: "App Salon",
    description: "Sistema de reservas de visitas desarrollado en Laravel para gestionar servicios y citas de forma ágil y flexible.",
    tech: ["Laravel", "PHP", "TypeScript", "MySQL"],
    image: "https://opengraph.githubassets.com/1/jevg2003/appsalon",
    github: "https://github.com/jevg2003/appsalon",
    live: null,
    isDeployed: false,
    stars: 0,
    forks: 0,
    language: "TypeScript"
  },
  {
    id: "InvitacionBabyShowerJuanMartin",
    title: "Baby Shower Juan Martin",
    description: "Invitación interactiva y animada desarrollada en Astro para celebrar el baby shower de Juan Martín.",
    tech: ["Astro", "Tailwind CSS", "JavaScript"],
    image: "https://api.microlink.io/?url=https%3A%2F%2Finvitacion-baby-shower-juan-martin.vercel.app&screenshot=true&embed=screenshot.url",
    github: "https://github.com/jevg2003/InvitacionBabyShowerJuanMartin",
    live: "https://invitacion-baby-shower-juan-martin.vercel.app",
    isDeployed: true,
    stars: 1,
    forks: 0,
    language: "Astro"
  },
  {
    id: "LiliPostres",
    title: "Lili Postres",
    description: "Sitio web de e-commerce y catálogo dinámico desarrollado en TypeScript para la repostería Lili Postres.",
    tech: ["TypeScript", "React", "Tailwind CSS", "Vite"],
    image: "https://api.microlink.io/?url=https%3A%2F%2Flili-postres.vercel.app&screenshot=true&embed=screenshot.url",
    github: "https://github.com/jevg2003/LiliPostres",
    live: "https://lili-postres.vercel.app",
    isDeployed: true,
    stars: 0,
    forks: 0,
    language: "TypeScript"
  }
];

const MECATEO_PROJECT: Project = {
  id: "mecateo",
  title: "Mecateo",
  description: "Plataforma colaborativa premium para la toma de pedidos, facturación de comandas y gestión de inventario en tiempo real.",
  tech: ["TypeScript", "Next.js", "Tailwind CSS", "PostgreSQL", "Monorepo"],
  image: "https://api.microlink.io/?url=https%3A%2F%2Fmecateo.arbelaeznicolas.dev%2Fterremoto%2Fmenu&screenshot=true&embed=screenshot.url",
  github: "",
  live: "https://mecateo.arbelaeznicolas.dev/terremoto/menu",
  isDeployed: true,
  stars: 0,
  forks: 0,
  language: "TypeScript"
};

// Memory cache to make local dev/prefetching instantaneous
const projectsCache: { data: Project[] | null; timestamp: number } = { data: null, timestamp: 0 };
const readmeCache: Map<string, string> = new Map();
const CACHE_TTL = 1000 * 60 * 15; // Cache for 15 minutes

export async function getProjects(): Promise<Project[]> {
  const now = Date.now();
  if (projectsCache.data && (now - projectsCache.timestamp < CACHE_TTL)) {
    return projectsCache.data;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`, {
      headers: {
        'User-Agent': 'Astro-Portfolio-App'
      }
    });

    if (!response.ok) {
      console.warn(`GitHub API returned status ${response.status}. Using fallback projects.`);
      const fallbackResult = [MECATEO_PROJECT, ...FALLBACK_PROJECTS];
      projectsCache.data = fallbackResult;
      projectsCache.timestamp = now;
      return fallbackResult;
    }

    const repos = await response.json();
    
    if (!Array.isArray(repos)) {
      const fallbackResult = [MECATEO_PROJECT, ...FALLBACK_PROJECTS];
      projectsCache.data = fallbackResult;
      projectsCache.timestamp = now;
      return fallbackResult;
    }

    // Filter out forks and map fields
    const mappedProjects = repos
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => {
        // Clean title name (e.g. "cruz-roja-dashboard" -> "Cruz Roja Dashboard")
        const title = repo.name
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const isDeployed = !!repo.homepage && repo.homepage.trim() !== '';
        
        // Assemble technologies array
        const tech = [];
        if (repo.language) tech.push(repo.language);
        if (Array.isArray(repo.topics)) {
          repo.topics.slice(0, 3).forEach((topic: string) => {
            const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
            if (!tech.includes(capitalizedTopic)) {
              tech.push(capitalizedTopic);
            }
          });
        }
        
        // Ensure some default tech tags are shown if empty
        if (tech.length === 0) tech.push("Web Dev");

        return {
          id: repo.name,
          title,
          description: repo.description || `Proyecto frontend moderno desarrollado en ${repo.language || 'código limpio'}.`,
          tech,
          image: isDeployed ? `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&embed=screenshot.url` : `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`,
          github: repo.html_url,
          live: isDeployed ? repo.homepage : null,
          isDeployed,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'HTML'
        };
      });

    const result = mappedProjects.length > 0 ? [MECATEO_PROJECT, ...mappedProjects] : [MECATEO_PROJECT, ...FALLBACK_PROJECTS];
    projectsCache.data = result;
    projectsCache.timestamp = now;
    return result;
  } catch (error) {
    console.error('Error fetching projects from GitHub:', error);
    const fallbackResult = [MECATEO_PROJECT, ...FALLBACK_PROJECTS];
    projectsCache.data = fallbackResult;
    projectsCache.timestamp = now;
    return fallbackResult;
  }
}

export async function getProjectReadme(repoName: string): Promise<string> {
  if (readmeCache.has(repoName)) {
    return readmeCache.get(repoName)!;
  }

  if (repoName === 'mecateo') {
    const result = `
# Mecateo - Gestión de Comandas

## Resumen del Proyecto
Mecateo es una plataforma colaborativa de alto rendimiento desarrollada para digitalizar e interconectar los flujos de toma de pedidos en restaurantes y locales comerciales. El sistema permite realizar pedidos interactivos directamente desde menús dinámicos, procesar facturación y actualizar cocinas en tiempo real.

### Arquitectura Técnica
- **Monorepo Estructurado**: División limpia de responsabilidades con un paquete de base de datos compartido y aplicaciones independientes integradas.
- **Diseño de Base de Datos**: Estructura relacional optimizada para consultas veloces sobre estados de pedidos e inventarios.
- **Tipado Estricto (TypeScript)**: Contratos de datos robustos para asegurar la consistencia del flujo de pedidos desde el cliente hasta el servidor.

---
*Nota de Privacidad: Este proyecto se encuentra bajo un acuerdo de código cerrado. El repositorio de GitHub es de carácter privado y el acceso al código fuente no está disponible al público general. Se puede explorar el sistema interactuando directamente en la aplicación en producción.*
`;
    readmeCache.set(repoName, result);
    return result;
  }

  const branches = ['main', 'master'];
  
  for (const branch of branches) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/README.md`);
      if (response.ok) {
        const readmeText = await response.text();
        readmeCache.set(repoName, readmeText);
        return readmeText;
      }
    } catch (e) {
      // Continue trying next branch
    }
  }

  // Fallback to a styled custom overview if README is not found
  const fallbackProjects = FALLBACK_PROJECTS.find(p => p.id === repoName);
  const desc = fallbackProjects ? fallbackProjects.description : "Detalles y documentación en proceso.";
  
  const fallbackReadme = `
# ${repoName}

## Resumen del Proyecto
${desc}

Este proyecto está registrado en tu perfil de GitHub y representa una implementación activa.

## Tecnologías Utilizadas
- Control de Versiones: Git
- Repositorio Público en GitHub

---
*Nota: Para ver la documentación extendida del código fuente, por favor ingresa al enlace directo de **Código Fuente** provisto en este panel.*
`;
  readmeCache.set(repoName, fallbackReadme);
  return fallbackReadme;
}
