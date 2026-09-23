export default defineNuxtConfig({
  compatibilityDate: '2026-07-14',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: [
    '@fontsource-variable/inter-tight/wght.css',
    '@fontsource-variable/jetbrains-mono/wght.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#0b0908' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.png?v=opendesign', type: 'image/png', sizes: '64x64' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=opendesign', sizes: '180x180' },
      ],
      script: [
        { innerHTML: "document.documentElement.classList.add('js')" },
        {
          src: 'https://analytics.agala.com.ar/script.js',
          defer: true,
          'data-website-id': '7ee2c48f-f170-491e-aeca-8fa369800a7c',
          'data-domains': 'julian.benitez.ar',
          'data-exclude-hash': 'true',
        },
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
