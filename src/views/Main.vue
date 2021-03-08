<template>
  <div class="main text-center" :class="[$vuetify.breakpoint.xsOnly ? 'w-90' : 'w-40']">
    <div class="category">
      <Home></Home>
    </div>
    <div class="category">
      <Projects></Projects>
    </div>
    <div class="category">
      <Contact></Contact>
    </div>
  </div>
</template>

<script>
import Home from '@/components/Home.vue'
import Contact from '@/components/Contact.vue'
import Projects from '@/components/Projects.vue'

export default {
  components: {
    Home,
    Contact,
    Projects
  }
}
</script>

<style>
.category{
  margin-bottom: 50px
}
</style>
