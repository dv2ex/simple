<template>
  <div id="app" class="p-0 m-0 box-border min-h-screen flex flex-col">
    <router-view />
    <PageFooter />
  </div>
</template>

<script>
import PageFooter from "./components/PageFooter.vue";
export default {
  components: {
    PageFooter,
  },
  async mounted() {
    await this.$store.dispatch("listUser");
  },
};
</script>

<style>
body,
html {
  @apply bg-white;
}
* {
  box-sizing: border-box;
}
</style>
