<script setup lang="ts">
defineProps<{ error: { statusCode: number, statusMessage?: string } }>()
</script>

<template>
  <div class="error-page">
    <SiteHeader />
    <main>
      <p class="overline">An unexpected turn</p>
      <h1>{{ error.statusCode }}</h1>
      <p>{{ error.statusMessage || 'This page could not be found.' }}</p>
      <NuxtLink to="/">Return home <span aria-hidden="true">↗</span></NuxtLink>
    </main>
  </div>
</template>
