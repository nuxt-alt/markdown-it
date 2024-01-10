<template>
  <div v-html="$md.render(model)"></div>
</template>

<script setup>
const model = '# Hello World!'
</script>