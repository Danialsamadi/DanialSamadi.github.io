import { ABOUT_ME, GITHUB_USERNAME, KNOWN_TECH, SITE_TITLE } from "@/consts";
import { getProjects } from "@/lib/projects";

// llms.txt spec: https://llmstxt.org — regenerated from live GitHub data on every build
export async function GET() {
  const projects = await getProjects();

  const projectLines = projects
    .map((p) => {
      const meta = [
        p.language,
        p.stars > 0 ? `${p.stars} stars` : null,
        `last updated ${p.pushed.slice(0, 10)}`,
      ]
        .filter(Boolean)
        .join(", ");
      const link = p.url
        ? `[${p.name}](${p.url})`
        : `${p.name} (private repository)`;
      const demo = p.homepage ? ` Live demo: ${p.homepage}` : "";
      return `- ${link}: ${p.description} (${meta})${demo}`;
    })
    .join("\n");

  const body = `# ${SITE_TITLE}

> Portfolio of ${SITE_TITLE} — full-stack developer and systems programmer based in Ottawa, Canada. Computer Programming graduate of Algonquin College (December 2025). Specializes in high-performance Go tooling, network utilities, and modern web applications. All open-source work lives at https://github.com/${GITHUB_USERNAME}.

${ABOUT_ME}

## Pages

- [Home](https://danisdev.me/): Overview, featured projects, skills, and bio
- [Projects](https://danisdev.me/projects): Complete registry of projects, pulled live from the GitHub API at build time
- [Contact](https://danisdev.me/contact): Contact form and direct channels
- [Resume](https://danisdev.me/Resume.pdf): Resume in PDF form

## Projects

${projectLines}

## Skills

${KNOWN_TECH.join(", ")}

## Contact

- Email: danisamadi11@gmail.com
- GitHub: https://github.com/${GITHUB_USERNAME}
- LinkedIn: https://linkedin.com/in/Danialsamadis

## Optional

- [GitHub profile README](https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}): Profile configuration and stats
- [Sitemap](https://danisdev.me/sitemap-index.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
