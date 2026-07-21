<script setup lang="ts">
import type { AgalaLabsStory } from '~/types/portfolio'

defineProps<{ story: AgalaLabsStory }>()
</script>

<template>
  <section id="labs" class="section labs" aria-labelledby="labs-heading">
    <div class="labs-intro">
      <div>
        <p class="section-context">My software factory</p>
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

    <div class="architecture" aria-labelledby="architecture-heading">
      <div class="architecture__heading">
        <h3 id="architecture-heading">The system behind the products</h3>
        <p>A public view of the real layers I build and operate across both products.</p>
      </div>
      <ol class="architecture__layers">
        <li v-for="layer in story.architecture" :key="layer.title">
          <div>
            <h4>{{ layer.title }}</h4>
            <p>{{ layer.description }}</p>
          </div>
          <ul>
            <li v-for="item in layer.items" :key="item">{{ item }}</li>
          </ul>
        </li>
      </ol>
    </div>

    <div class="agentic" aria-labelledby="agentic-heading">
      <div class="agentic__heading">
        <p class="section-context">AI and agentic engineering</p>
        <h3 id="agentic-heading">How I use agents, and what I built with them</h3>
      </div>
      <div class="agentic__list">
        <article v-for="area in story.agenticWork" :key="area.title">
          <h4>{{ area.title }}</h4>
          <p>{{ area.description }}</p>
          <p class="agentic__tools">{{ area.tools.join(' · ') }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
