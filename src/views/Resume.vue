<template>
  <div class="resume text-center" :class="[$vuetify.breakpoint.xsOnly ? 'w-90' : 'w-40']">
    <h1>Julián Benitez</h1>
    <h2 class="my-5">
      {{ text.resumeText }}
      <v-btn
        class="mx-2"
        fab
        dark
        x-small
        color="gray"
        @click="downloadResume">
        <v-icon dark>
          mdi-download
        </v-icon>
      </v-btn>
    </h2>
    <div 
      v-for="(field, index) in text.fields"
      class="field">
      <h3>{{ field.text }}</h3>
      <v-divider class="my-3"></v-divider>
      <Experience
        v-for="(experience, index) in field.experiences"
        :key="`${index} / field.text`"
        :text="experience">
      </Experience>
    </div>
  </div>
</template>

<script>
import Experience from '../components/Experience.vue'

export default {
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('Resume')
    },
  },
  methods: {
    downloadResume(){
      this.$store.getters.actualLanguage == 'EN' ? alert('English') : alert('Spanish')
    }
  },
  components: {
    Experience
  }
}
</script>
