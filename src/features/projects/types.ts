export interface Project {
  id: string;          // repo name (e.g. "cruz-roja-dashboard")
  title: string;       // clean readable name (e.g. "Cruz Roja Dashboard")
  description: string; // repo description or fallback
  tech: string[];      // combined languages and topics
  image: string;       // repository preview card or fallback
  github: string;      // repo github url
  live: string | null; // vercel or pages live url
  isDeployed: boolean; // whether a live url exists
  stars: number;       // github stargazers_count
  forks: number;       // github forks_count
  language: string;    // primary language
}
