import { GITHUB_USERNAME } from "@/consts";

export interface Project {
  name: string;
  description: string;
  url: string | null; // null = restricted/private
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  pushed: string; // ISO date
}

// Repos that add no signal to the portfolio
const EXCLUDE = new Set([
  "danialsamadi.github.io",
  "DanialSamadi.github.io-old",
  "Danialsamadi",
]);

// Descriptions for repos that have none on GitHub
const DESCRIPTIONS: Record<string, string> = {
  "iran-internet-monitor":
    "Live dashboard monitoring internet connectivity and censorship events in Iran.",
  Netray: "Network diagnostics toolkit written in Go.",
};

// Not on GitHub — appended manually
const RESTRICTED: Project[] = [
  {
    name: "FindIT",
    description:
      "Cross-platform indoor navigation system for large buildings. Flutter frontend, Python backend, OpenStreetMap APIs and MongoDB for step-by-step guidance where GPS fails.",
    url: null,
    language: "Flutter",
    stars: 0,
    forks: 0,
    pushed: "2025-04-01T00:00:00Z",
  },
];

// ponytail: build-time snapshot fallback — refresh by running `npm run build` locally; keeps CI green when the GitHub API rate-limits
const SNAPSHOT: Project[] = [
  {
    name: "v2go",
    description:
      "Blazingly fast Go V2Ray config aggregator that processes 20,000+ configurations in 11 seconds (99.7% faster than Python), automatically removing duplicates and generating fresh subscription files every 6 hours.",
    url: "https://github.com/Danialsamadi/v2go",
    language: "Go",
    stars: 130,
    forks: 28,
    pushed: "2026-07-22T00:11:36Z",
  },
  {
    name: "iran-internet-monitor",
    description:
      "Live dashboard monitoring internet connectivity and censorship events in Iran.",
    url: "https://github.com/Danialsamadi/iran-internet-monitor",
    language: "HTML",
    stars: 7,
    forks: 0,
    pushed: "2026-07-21T23:34:43Z",
  },
  {
    name: "cf-knife",
    description:
      "High-performance Cloudflare & Fastly IP scanner with TLS/HTTP probing, DPI bypass analysis, WARP scanning, and anti-MITM detection. Single binary, cross-platform.",
    url: "https://github.com/Danialsamadi/cf-knife",
    language: "Go",
    stars: 6,
    forks: 0,
    pushed: "2026-04-20T02:43:48Z",
  },
  {
    name: "Free-macos",
    description:
      "Terminal-based memory monitor for macOS that replicates Linux's `free` command with enhanced visuals. Real-time updates, Rich progress bars, Click CLI.",
    url: "https://github.com/Danialsamadi/Free-macos",
    language: "Python",
    stars: 4,
    forks: 0,
    pushed: "2025-11-03T16:04:06Z",
  },
  {
    name: "Syncodoro",
    description:
      "Full-featured PWA Pomodoro timer with offline-first architecture, cloud sync (Supabase), session analytics, and export capabilities. React, TypeScript, Tailwind, IndexedDB.",
    url: "https://github.com/Danialsamadi/Syncodoro",
    language: "TypeScript",
    stars: 3,
    forks: 0,
    pushed: "2025-11-03T16:01:04Z",
  },
  {
    name: "Netray",
    description: "Network diagnostics toolkit written in Go.",
    url: "https://github.com/Danialsamadi/Netray",
    language: "Go",
    stars: 1,
    forks: 0,
    pushed: "2026-02-28T02:17:41Z",
  },
  {
    name: "rssi",
    description:
      "Wi-Fi RSSI trilateration — estimates device position from access-point signal strengths.",
    url: "https://github.com/Danialsamadi/rssi",
    language: "Python",
    stars: 1,
    forks: 0,
    pushed: "2025-01-02T22:13:41Z",
  },
  {
    name: "Memmory-leaks-go",
    description:
      "Hands-on Go memory leak tutorial with tested examples, pprof profiling, and comprehensive learning resources.",
    url: "https://github.com/Danialsamadi/Memmory-leaks-go",
    language: "Go",
    stars: 0,
    forks: 0,
    pushed: "2026-01-06T19:09:18Z",
  },
  {
    name: "visualArt",
    description:
      "3D visualization of a dynamic point cloud with React and Three.js.",
    url: "https://github.com/Danialsamadi/visualArt",
    homepage: "https://danialsamadi.github.io/visualArt/",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    pushed: "2026-04-02T03:58:17Z",
  },
  {
    name: "kumo-portfolio",
    description:
      "Client portfolio gallery for an animation student — responsive React web app.",
    url: "https://github.com/Danialsamadi/kumo-portfolio",
    homepage: "https://thekumorii.github.io/portfolio/",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    pushed: "2025-01-05T00:03:14Z",
  },
];

export async function getProjects(): Promise<Project[]> {
  let repos = SNAPSHOT;
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (import.meta.env.GITHUB_TOKEN)
      headers.Authorization = `Bearer ${import.meta.env.GITHUB_TOKEN}`;
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    repos = data
      .filter(
        (r: any) =>
          !r.fork &&
          !r.archived &&
          !EXCLUDE.has(r.name) &&
          (r.description || r.stargazers_count > 0),
      )
      .map((r: any): Project => ({
        name: r.name,
        description:
          r.description ??
          DESCRIPTIONS[r.name] ??
          `${r.language ?? "Source"} repository. No manifest on file.`,
        url: r.html_url,
        homepage: r.homepage || undefined,
        language: r.language ?? "N/A",
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushed: r.pushed_at,
      }));
  } catch (e) {
    console.warn("[projects] GitHub fetch failed, using snapshot:", e);
  }
  return [...repos, ...RESTRICTED].sort((a, b) => b.stars - a.stars);
}
