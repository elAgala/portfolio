<script setup lang="ts">
import resumeStyles from '~/assets/css/main.css?inline'

const route = useRoute()
const config = useRuntimeConfig()
const canonicalUrl = computed(() => `${config.public.siteUrl}${route.path}`)

useHead({
  style: computed(() => route.path === '/resume' ? [{ key: 'resume-design', innerHTML: resumeStyles }] : []),
  titleTemplate: (title) => title ? `${title} — Agala / Julián Benitez` : 'Agala / Julián Benitez — Software Engineer / Tech Lead',
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

useSeoMeta({
  ogSiteName: 'Agala / Julián Benitez',
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
