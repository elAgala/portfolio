<script setup lang="ts">
import { profile as person } from '~/data/profile'
import { social } from '~/data/social'

useSeoMeta({
  title: social.title,
  description: social.description,
  ogTitle: social.title,
  ogDescription: social.description,
  twitterTitle: social.title,
  twitterDescription: social.description,
})

useHead({
  titleTemplate: null,
  bodyAttrs: { class: 'portfolio-body' },
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      alternateName: person.brand,
      jobTitle: person.title,
      email: person.email,
      url: `https://${person.website}`,
      worksFor: { '@type': 'Organization', name: person.organization, url: person.organizationUrl },
      sameAs: person.links.filter(link => link.label === 'GitHub').map(link => link.url),
    }),
  }],
})

</script>

<template>
  <PortfolioDesign />
</template>
