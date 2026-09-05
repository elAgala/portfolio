<script setup lang="ts">
import resumeStyles from '~/assets/css/main.css?inline'
import { social } from '~/data/social'

const route = useRoute()
const config = useRuntimeConfig()
const canonicalUrl = computed(() => `${config.public.siteUrl}${route.path}`)

useHead({
  style: computed(() => route.path === '/resume' ? [{ key: 'resume-design', innerHTML: resumeStyles }] : []),
  titleTemplate: (title) => title ? `${title} — Julián Benitez` : social.title,
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

useSeoMeta({
  ogSiteName: 'Julián Benitez',
  ogType: 'website',
  ogImage: () => `${config.public.siteUrl}${social.image}`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: social.imageAlt,
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterImage: () => `${config.public.siteUrl}${social.image}`,
  twitterImageAlt: social.imageAlt,
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
