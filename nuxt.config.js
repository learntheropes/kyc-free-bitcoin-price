const deploymentDomain = process.env.DEPLOYMENT_DOMAIN || 'http://localhost:3000';
const isDeployed = process.env.NODE_ENV === 'production' && deploymentDomain !== 'http://localhost:3000';
export default defineNuxtConfig({

  runtimeConfig: {
    torProxySecret: process.env.TOR_PROXY_SECRET,
    robosatsCoordinatorOnionUrl: process.env.ROBOSATS_COORDINATOR_ONION_URL,
    torSocksUrl: 'socks5h://127.0.0.1:9050',
    public: {
      deploymentDomain
    }
  },

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
    'nuxt-delay-hydration',
    'nuxt-umami'
  ],

  umami: {
    enabled: (isDeployed) ? true : false,
    id: process.env.UMAMI_ID,
    host: process.env.UMAMI_HOST,
    autoTrack: true,
  },

  delayHydration: {
    mode: 'init',
    debug: process.env.NODE_ENV === 'development'
  },
});
