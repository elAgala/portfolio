<template>
  <div class="experience">
    <h4>{{ text.title }}</h4>
    <div class="exerience-info pa-5">
      <span v-if="text.subtitle" class="text-light">{{ text.subtitle }}</span>
      <div class="items ma-5">
        <template 
          v-for="(item, i) in text.items">
          {{ item }}
          <br>
        </template>
      </div>
      <span v-if="text.duration">{{ text.duration }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: Object
  }
}
</script>

<style>
ul{
  list-style: inside;
  text-align: center;
}
</style>
