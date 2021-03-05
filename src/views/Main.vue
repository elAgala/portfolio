<template>
  <div class="main text-center">
    <div class="w-40">
      <Home></Home>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Home from '@/components/Home.vue'

export default {
  components: {
    Home
  }
}
</script>

<style>
.w-40{
  max-width: 40%;
  margin: auto
}
</style>
