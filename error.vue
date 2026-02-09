<script setup>
const { error } = defineProps({
  error: { type: Object, required: true }
})

const errorMessage = computed(() => {
  switch (error.statusCode) {
    case 404:
      return `This currency could not be found`
    default:
      return 'Something went wrong'
  }
})

useHead({
  title: String(error.statusCode),
  meta: [
    { name: 'description', content: errorMessage }
  ]
})

const handleError = () => clearError({ redirect: `/` })
</script>

<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title">{{ errorMessage }}</p>
        <DevOnly v-if="error.statusCode !== 404">
          <div class="block content">
            <div>{{ error.statusMessage }}</div>
            <div>{{ error.stack }}</div>
          </div>
        </DevOnly>
        <button @click.native="handleError" class="button is-primary is-outlined">Back
          to the home page</button>
      </div>
    </div>
  </div>
</template>
