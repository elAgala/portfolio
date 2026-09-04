<script setup lang="ts">
import type { AgalaLabsStory } from '~/types/portfolio'

defineProps<{ story: AgalaLabsStory }>()
</script>

<template>
  <section id="labs" class="section labs" aria-labelledby="labs-heading">
    <div class="labs-intro">
      <div>
        <p class="section-context">Independent software factory</p>
        <h2 id="labs-heading">{{ story.name }}</h2>
      </div>
      <div class="labs-intro__copy">
        <p>{{ story.introduction }}</p>
        <p>{{ story.responsibility }}</p>
        <a :href="story.url" target="_blank" rel="noreferrer">Visit Agala Labs ↗</a>
      </div>
    </div>

    <div class="product-stories" aria-label="Agala Labs products">
      <article v-for="product in story.products" :key="product.name" class="product-story">
        <a class="product-story__image" :href="product.href" target="_blank" rel="noreferrer">
          <img :src="product.image" :alt="`Screenshot of ${product.name}`" width="1440" height="760" loading="lazy">
        </a>
        <div class="product-story__copy">
          <p class="section-context">{{ product.category }}</p>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p>{{ product.contribution }}</p>
          <a :href="product.href" target="_blank" rel="noreferrer">Visit {{ product.name }} ↗</a>
        </div>
      </article>
    </div>

  </section>
</template>
