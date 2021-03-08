<template>
  <div id="contact">
    <h1>{{ text.contactMe }}</h1>
    <h4>{{ text.contactText }}<a href="mailto:julian@benitez.com.ar"> julian@benitez.com.ar</a></h4>
    <template>
      <v-form
        class="pa-10"
        ref="form"
        v-model="valid"
        lazy-validation>
        <v-text-field
          outlined
          color="dark"
          v-model="name"
          :rules="nameRules"
          :label="text.name"
          required
        ></v-text-field>
        <v-text-field
          outlined
          color="dark"
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-textarea
          color="dark"
          outlined
          name="input-7-4"
          :label="text.message"
          :rules="messageRules"
          rows="3"
        ></v-textarea>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="sendMessage">
          {{ text.submit }}
        </v-btn>
      </v-form>
    </template>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    name: '',
    email: '',
  }),
  computed: {
    text(){
      return this.$store.getters.getTextForComponent('Contact')
    },
    nameRules(){
      return [
        v => !!v || this.text.errorMessages.name
      ]
    },
    emailRules(){
      return [
        v => !!v || this.text.errorMessages.email.required,
        v => /.+@.+\..+/.test(v) || this.text.errorMessages.email.condition 
      ]
    },
    messageRules(){
      return [
        v => !!v || this.text.errorMessages.message.required,
        v => (v && v.length <= 100) || this.text. errorMessages.message.condition
      ]
    }
  },
  methods: {
    sendMessage(){
      this.$refs.form.validate()
    },
  }
}
</script>
