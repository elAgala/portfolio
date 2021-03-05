<template>
  <div class="home text-center">
    <!--    <video autoplay muted loop id="myVideo">
      <source src="@/assets/background.mp4" type="video/mp4">
      </video> -->
      <h1>Julián Benitez</h1>
      <h3 class="my-4">{{ text.subtitle }}</h3>
      <v-avatar
        :size="imageSize">
        <v-img src="@/assets/img/me.jpg"></v-img>
      </v-avatar>
      <h4 class="my-4">{{ text.greeting }}</h4>
      <p class="my-2">{{ text.about }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('Home')
    },
    imageSize(){
      return this.$vuetify.breakpoint.xsOnly ? '120' : '200'
    }
  }
}
</script>
