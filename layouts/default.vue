<script setup>
const nuxtApp = useNuxtApp();
const host = (process.client) 
  ? window.location.href.replace('https://', '').replace('http://', '').replace('/', '')
  : nuxtApp.ssrContext.event.node.req.headers.host;

const {
  public: {
    deploymentDomain
  }
} = useRuntimeConfig();

const { fullPath } = useRoute();

if (host !== deploymentDomain.replace('https://', '').replace('http://', '')) {
  await navigateTo(`${deploymentDomain}${fullPath}`, {
    external: true,
    redirectCode: 301
  })
}
</script>
<template>
  <div>
    <Html>
      <Body>
        <div class="full-body">
          <main class="main-content">
            <div class="container">
              <slot />
            </div>
          </main>
          <LoadingOffers />
          <LayoutFooter />
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