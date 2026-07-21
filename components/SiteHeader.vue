<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu()
    document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
  }
}

watch(() => route.fullPath, closeMenu)
watch(menuOpen, open => document.body.classList.toggle('menu-open', open))

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-mark" to="/" aria-label="Agala, Julián Benitez, home">
      Agala
    </NuxtLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      @click="menuOpen = !menuOpen"
    >
      {{ menuOpen ? 'close' : 'menu' }}
    </button>

    <nav id="primary-navigation" class="site-nav" :class="{ 'site-nav--open': menuOpen }" aria-label="Primary navigation">
      <a href="https://agala.com.ar" target="_blank" rel="noreferrer" @click="closeMenu">Agala Labs ↗</a>
      <a href="/#work" @click="closeMenu">Public work</a>
      <a href="/#career" @click="closeMenu">Experience</a>
      <a href="/#contact" @click="closeMenu">Contact</a>
      <NuxtLink class="site-nav__resume" to="/resume" @click="closeMenu">Resume</NuxtLink>
    </nav>
  </header>
</template>
