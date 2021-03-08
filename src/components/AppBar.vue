<template>
  <v-app-bar dark app>
    <v-app-bar-nav-icon 
      v-if="isMobile"
      @click="$emit('drawer')">
    </v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn-toggle
      v-if="!isMobile"
      centered
      borderless
      @click="$emit('changeTab', $event)">
      <router-link
        v-for="title in text.titles" 
        :to="{ name: title.route, hash: title.hash }">
        <v-btn>
          {{ title.text }}
        </v-btn>
      </router-link>
    </v-btn-toggle>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs"
          v-on="on">
          {{ actualLanguage }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(language, index) in languages" :key="index"
          color="primary"
          class="set-pointer"
          @click="changeLanguage(language.text)">
          <v-list-item-title>{{ language.text }}</v-list-item-title>
          <!--<v-list-item-avatar>
            <v-img :src="'@/assets/img/' + language.path"></v-img>
          </v-list-item-avatar> -->
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    languages: [{text: 'EN', path: 'usa.png'}, {text: 'SP', path: 'arg.png'}],
  }),
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('AppBar')
    },
    actualLanguage(){
      return this.$store.getters.actualLanguage
    },
    isMobile(){
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  methods: {
    changeLanguage(newLanguage){
      this.$store.commit('changeLanguage', newLanguage)
    }
  }
}
</script>
