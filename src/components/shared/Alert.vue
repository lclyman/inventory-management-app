<template>
  <v-alert :color="type" icon="info" dismissible  @input="onClose" :value="true">
    {{msg}}
  </v-alert>
</template>

<script>
export default {
  props: ["msg", "type"],
  methods: {
    onClose() {
      this.$emit("dismissed");
    }
  }
};
</script>

<style scoped>

</style>