import type { APIRoute } from 'astro';

/**
 * Without SITE_URL the build is a preview: it must not be indexed and has no
 * sitemap (sitemaps require absolute URLs). PUBLIC_PREVIEW=1 keeps a build
 * with a SITE_URL (e.g. a GitHub Pages demo) out of search engines too.
 */
export const robots: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const preview = import.meta.env.PUBLIC_PREVIEW === '1';
  const body =
    site && !preview
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${base}/sitemap.xml`, site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

export function sitemap(paths: string[]): APIRoute {
  return ({ site }) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const urls = site
      ? paths.map((path) => `  <url><loc>${new URL(`${base}${path}`, site).href}</loc></url>`)
      : [];
    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
    return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  };
}
