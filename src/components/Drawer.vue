<template>
  <v-navigation-drawer 
    app 
    v-if="isMobile"
    @input="manageClose" 
    :value="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Julián Benitez
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ text.subtitle }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list
      dense
      nav>
      <router-link
        v-for="(title, index) in text.titles" 
        :key="index"
        :to="{ name: title.route, hash: title.hash }">
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>{{ title.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    drawer: Boolean
  },
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('Drawer')
    },
    isMobile(){
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  methods: {
    manageClose(event){
      if(!event)
        this.$emit('close')
    }
  },
}
</script>
