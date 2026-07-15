<script setup lang="ts">
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.value?.classList.add('is-visible')
    return
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    root.value?.classList.add('is-visible')
    observer.disconnect()
  }, { threshold: 0.14 })

  observer.observe(root.value)
})
</script>

<template>
  <div ref="root" class="reveal-on-scroll">
    <slot />
  </div>
</template>
