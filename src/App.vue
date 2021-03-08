<template>
  <v-app>
    <AppBar @drawer="drawer = true"></AppBar>
    <Drawer :drawer="drawer" @close="drawer = false"></Drawer>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <Footer></Footer>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from './components/Drawer.vue'
import AppBar from './components/AppBar.vue'
import Footer from './components/Footer.vue'

export default {
  data: () => ({
    drawer: false
  }),
  components: {
    AppBar,
    Drawer,
    Footer
  }
}
</script>

<style lang="scss">
.set-pointer {
  cursor: pointer
}
.w-90{
  max-width: 90%;
  margin: auto;
}
.w-40{
  max-width: 40%;
  margin: auto;
}
a{
  text-decoration: none
}
</style>
