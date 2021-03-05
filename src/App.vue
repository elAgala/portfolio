<template>
  <v-app>
    <AppBar @drawer="drawer = true"></AppBar>
    <Drawer :drawer="drawer" @close="drawer = false"></Drawer>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from './components/Drawer.vue'
import AppBar from './components/AppBar.vue'

export default {
  data: () => ({
    drawer: false
  }),
  components: {
    AppBar,
    Drawer
  }
}
</script>

<style lang="scss">
.set-pointer {
  cursor: pointer
}
</style>
