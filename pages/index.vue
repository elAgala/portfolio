<script setup lang="ts">
import { profile as person } from '~/data/profile'

useSeoMeta({
  title: 'Julián Benitez | Technical Lead & Software Engineer',
  description: person.summary,
  ogTitle: 'Agala / Julián Benitez — Software Engineer & Tech Lead',
  ogDescription: person.summary,
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
