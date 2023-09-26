<script setup>
  const isLoading = ref(true);
  const { $listen } = useNuxtApp();
  $listen('isLoading', bool => {
    isLoading.value = bool;
  });
</script>

<template>
  <div v-if="isLoading" class="columns is-centered is-overlay is-align-items-center">
    <div class="column is-narrow">
      <span class="icon is-large">
        <i class="mdi mdi-48px mdi-loading" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.mdi-loading {
  animation: spinAround 500ms infinite linear;
}
</style>