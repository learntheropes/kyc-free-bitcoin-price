<script setup>
// const nuxtApp = useNuxtApp();
// const host = (process.client) 
//   ? window.location.href.replace('https://', '').replace('http://', '').replace('/', '')
//   : nuxtApp.ssrContext.event.node.req.headers.host;

// const {
//   public: {
//     deploymentDomain
//   }
// } = useRuntimeConfig();

// const { fullPath } = useRoute();

// if (host !== deploymentDomain.replace('https://', '').replace('http://', '')) {
//   await navigateTo(`${deploymentDomain}${fullPath}`, {
//     external: true,
//     redirectCode: 301
//   })
// }
const route = useRoute()

const title = 'KYC Free Bitcoin Price'

useHead({
  title: title,
  meta: [
    {
      name: 'description',
      content: 'Comparison website to purchase KYC free bitcoins at the cheapes price available on the free market.'
    },
  ],
});
</script>

<template>
  <div>
    <Html>
      <Body>
        <div class="full-body">
          <main class="main-content">
            <div class="container">
              <section class="section">
                <div class="columns is-centered">
                  <div class="column is-narrow">
                    <h1 class="title is-1 has-text-centered">
                      <NuxtLink to="/" class="has-text-black">{{ title }}</NuxtLink>
                    </h1>
                    <div class="subtitle is-6 has-text-centered">
                      <span class="icon">
                        <i class="mdi mdi-github" />
                      </span>
                      <NuxtLink
                        href="https://github.com/learntheropes/kyc-free-bitcoin-price"
                        target="_blank"
                      >learntheropes/kyc-free-bitcoin-price</NuxtLink>
                    </div>
                  </div>
                </div>
              </section>
              <slot />
            </div>
          </main>
          <LoadingOffers v-if="route.name === 'currency'" />
          <LayoutFooter v-if="route.name === 'currency'" />
        </div>
      </Body>
    </Html>
  </div>
</template>

<style scoped>
.full-body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.main-content {
  flex: 1;
}
</style>