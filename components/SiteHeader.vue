<script setup lang="ts">
defineProps<{
  light?: boolean
}>()

const route = useRoute()
const menuOpen = ref(false)

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--light': light }">
    <NuxtLink class="site-mark" to="/" aria-label="Julián Benitez, home">
      <span aria-hidden="true">JB</span>
    </NuxtLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      @click="menuOpen = !menuOpen"
    >
      <span>{{ menuOpen ? 'Close' : 'Menu' }}</span>
    </button>

    <nav id="primary-navigation" class="site-nav" :class="{ 'site-nav--open': menuOpen }" aria-label="Primary navigation">
      <NuxtLink to="/#work">Work</NuxtLink>
      <NuxtLink to="/#profile">Profile</NuxtLink>
      <NuxtLink to="/resume">Résumé</NuxtLink>
      <a href="mailto:julian@benitez.com.ar">Contact</a>
    </nav>
  </header>
</template>
