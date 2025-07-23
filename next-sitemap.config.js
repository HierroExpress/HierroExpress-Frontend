/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hierroexpress.com.uy',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin*', '/superadmin*', '/auth*', '/test*'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom transform for dynamic routes with categories
    if (path === '/menu2') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    // For category pages, set higher priority
    if (path.startsWith('/menu2/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    // Use default for other pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};