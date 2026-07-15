<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const canonicalUrl = computed(() => `${config.public.siteUrl}${route.path}`)

useHead({
  titleTemplate: (title) => title ? `${title} — Julián Benitez` : 'Julián Benitez — Software Engineer',
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

useSeoMeta({
  ogSiteName: 'Julián Benitez',
  ogType: 'website',
  ogImage: () => `${config.public.siteUrl}/og-image.png`,
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterImage: () => `${config.public.siteUrl}/og-image.png`,
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
