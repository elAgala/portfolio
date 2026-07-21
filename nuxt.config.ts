export default defineNuxtConfig({
  compatibilityDate: '2026-07-14',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: [
    '@fontsource-variable/inter-tight/wght.css',
    '@fontsource-variable/jetbrains-mono/wght.css',
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
      routes: ['/', '/resume'],
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
  },
})
