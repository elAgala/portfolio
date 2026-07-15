export default defineNuxtConfig({
  compatibilityDate: '2026-07-14',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: [
    '@fontsource-variable/bodoni-moda/wght.css',
    '@fontsource-variable/bodoni-moda/wght-italic.css',
    '@fontsource-variable/manrope/wght.css',
    '@fontsource-variable/jetbrains-mono/wght.css',
    '~/assets/css/main.css',
    '~/assets/css/portfolio.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#f2ebdd' },
        { name: 'color-scheme', content: 'light' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://julian.benitez.ar',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/resume', '/work/agala-ui', '/work/agala-deploy', '/work/agala-ai', '/work/agala-setup'],
    },
  },
  routeRules: {
    '/**': { prerender: true },
  },
  typescript: {
    typeCheck: true,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 550,
      modulePreload: false,
    },
    optimizeDeps: {
      include: ['three'],
    },
  },
})
