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
      <v-list-item
        v-for="title in text.titles"
        :key="title"
        link>
        <v-list-item-content>
          <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
