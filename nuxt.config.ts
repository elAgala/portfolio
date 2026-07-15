export default defineNuxtConfig({
  compatibilityDate: '2026-07-14',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: [
    '@fontsource-variable/bodoni-moda/wght.css',
    '@fontsource-variable/bodoni-moda/wght-italic.css',
    '@fontsource-variable/manrope/wght.css',
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#0b0908' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'preconnect', href: 'https://avatars.githubusercontent.com' },
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
      routes: ['/', '/resume', '/work/agala-ui', '/work/agala-deploy', '/work/agala-ai'],
    },
  },
  routeRules: {
    '/**': { prerender: true },
  },
  typescript: {
    typeCheck: true,
  },
})
