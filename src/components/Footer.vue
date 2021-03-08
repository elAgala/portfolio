<template>
  <v-footer
    dark
    padless>
    <v-card
      class="flex"
      flat
      tile>
      <v-card-title>
        <strong class="subheading">{{ text.subheader }}</strong>
        <v-spacer></v-spacer>
        <v-btn
          v-for="network in networks"
          :key="network.icon"
          class="mx-4"
          @click="openWindow(network.link)"
          dark
          icon>
          <v-icon size="24px">
            {{ network.icon }}
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>Julián Benitez</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    networks: [
      {
        icon: 'mdi-linkedin',
        link: 'https://www.linkedin.com/in/juli%C3%A1n-benitez-9868b21b8/'
      },
      {
        icon: 'mdi-github',
        link: 'https://github.com/elAgala'
      },
    ],
  }),
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('Footer')
    }
  },
  methods: {
    openWindow(link){
      window.open(link, '_blank')
    }
  }
}
</script>
