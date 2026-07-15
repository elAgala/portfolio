<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{
  person: Profile
}>()
</script>

<template>
  <section id="profile" class="workbench-profile" aria-labelledby="profile-heading">
    <div class="workbench-profile__intro">
      <p class="workbench-eyebrow">03 · Operating principles</p>
      <h2 id="profile-heading">GUI instincts.<br>Terminal discipline.</h2>
      <p>{{ person.manifesto }}</p>
      <NuxtLink class="workbench-inline-link" to="/resume">Review the formal record <span aria-hidden="true">↗</span></NuxtLink>
    </div>

    <div class="capability-terminal">
      <header><span>julian@workbench</span><span>capabilities.sh</span></header>
      <dl>
        <div v-for="(capability, index) in person.capabilities" :key="capability.title">
          <span aria-hidden="true">0{{ index + 1 }}</span>
          <dt>{{ capability.title }}</dt>
          <dd>{{ capability.description }}</dd>
          <dd><code>{{ capability.tools.join(' · ') }}</code></dd>
        </div>
      </dl>
    </div>

    <ol class="principle-list">
      <li v-for="principle in person.principles" :key="principle.number">
        <span>{{ principle.number }}</span>
        <h3>{{ principle.title }}</h3>
        <p>{{ principle.description }}</p>
      </li>
    </ol>
  </section>
</template>
