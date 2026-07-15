<script setup lang="ts">
const route = useRoute()

function replayIntro() {
  window.dispatchEvent(new Event('jb-replay-intro'))
}
</script>

<template>
  <footer class="site-footer">
    <p>Built with intent in Buenos Aires.</p>
    <div>
      <button v-if="route.path === '/'" type="button" @click="replayIntro">Replay introduction</button>
      <p>© {{ new Date().getFullYear() }} Julián Benitez</p>
    </div>
  </footer>
</template>
