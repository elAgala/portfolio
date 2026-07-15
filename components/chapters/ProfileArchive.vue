<script setup lang="ts">
import type { Profile } from '~/types/portfolio'
import StaticPortfolio from './StaticPortfolio.vue'

defineProps<{
  person: Profile
}>()
</script>

<template>
  <section
    id="profile"
    class="archive experience-stage chapter chapter--right"
    data-experience-x="72"
    data-experience-chapter="profile"
    aria-labelledby="archive-title"
  >
    <StaticPortfolio chapter="profile" label="The archive" />
    <div class="archive__dossier">
      <div class="archive__portrait">
        <img :src="person.avatar" width="460" height="575" alt="Portrait of Julián Benitez" loading="lazy">
        <span aria-hidden="true">Dossier · JB/01</span>
      </div>
      <div class="archive__record chapter__copy">
        <p class="overline">02 · The archive</p>
        <h2 id="archive-title">Close to the code.<br><em>Present for the consequence.</em></h2>
        <p class="archive__manifesto">{{ person.manifesto }}</p>
        <NuxtLink class="editorial-action" to="/resume">Review the formal record <span aria-hidden="true">↗</span></NuxtLink>
      </div>
    </div>

    <div class="archive__index" aria-labelledby="capabilities-title">
      <div class="archive__index-heading">
        <p class="overline">Capability index</p>
        <h3 id="capabilities-title">The working record</h3>
      </div>
      <dl class="capability-index">
        <div v-for="(capability, index) in person.capabilities" :key="capability.title">
          <span aria-hidden="true">0{{ index + 1 }}</span>
          <dt>{{ capability.title }}</dt>
          <dd>{{ capability.description }}</dd>
          <dd class="capability-index__tools">{{ capability.tools.join(' · ') }}</dd>
        </div>
      </dl>
    </div>

    <div class="archive__principles" aria-labelledby="principles-title">
      <div class="archive__index-heading">
        <p class="overline">Working principles</p>
        <h3 id="principles-title">A quiet kind of rigor.</h3>
      </div>
      <ol class="principle-index">
        <li v-for="principle in person.principles" :key="principle.number">
          <span>{{ principle.number }}</span>
          <h4>{{ principle.title }}</h4>
          <p>{{ principle.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
