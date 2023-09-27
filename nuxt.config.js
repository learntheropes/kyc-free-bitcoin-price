const deploymentDomain = process.env.DEPLOYMENT_DOMAIN || 'http://localhost:3000';

export default defineNuxtConfig({

  $production: {
    routeRules: []
  },

  app: {
    head: {
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        {
          lang: 'en'
        },
        {
          id: 'og:type',
          name: 'og:type',
          content: 'website'
        },
        {
          id: 'og:url',
          name: 'og:url',
          content: deploymentDomain
        },
        {
          id: 'og:site_name',
          name: 'og:site_name',
          content: 'KYC Free Bitcoin Price'
        },
        {
          id: 'og:image',
          name: 'og:image',
          content: `${deploymentDomain}/favicon/favicon.png`
        },
        {
          id: 'twitter:card',
          name: 'twitter:card',
          content: 'summary'
        },
        {
          id: 'twitter:image',
          name: 'twitter:image',
          content: `${deploymentDomain}/favicon/favicon.png`
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon/favicon.ico'
        },
      ]
    },
  },

  runtimeConfig: {
    public: {
      deploymentDomain
    }
  },

  css: [
    '~/assets/scss/custom.scss',
    '~/assets/scss/mdi.scss',
  ],

  components: [{
    path: '~/components',
    pathPrefix: false,
    global: true
  }],

  modules: [
    // 'nuxt-simple-robots',
    // 'nuxt-simple-sitemap',
    'nuxt-delay-hydration'
  ],

  // robots: {
  //   userAgents: ['*'],
  //   disallow: ['/cdn-cgi', ...localeCodes.map(code => `/${code}/invoice`)],
  //   sitemap: `${deploymentDomain}/sitemap_index.xml`
  // },

  // sitemap: {
  //   xsl: false,
  //   autoI18n: false,
  //   sitemapName: `sitemap_index.xml`
  // },

  delayHydration: {
    mode: 'init',
    debug: process.env.NODE_ENV === 'development'
  },
});
