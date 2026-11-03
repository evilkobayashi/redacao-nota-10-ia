import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/historico', '/pagamento', '/auth'],
    },
    sitemap: 'https://redacao.aitecnologia.xyz/sitemap.xml',
  }
}
