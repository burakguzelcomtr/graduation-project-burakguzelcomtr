<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const auth = useAuthStore() 
const showSidebar = computed(() => route.path !== '/' && route.path !== '/login' && route.path !== '/404')
 
</script>

<template lang="pug">
.lp-app
  Sidebar(v-if="showSidebar")
  main.lp-app__main
    Suspense
      RouterView
</template>

<style lang="scss">
body {
  margin: 0;
  background: #f8f9fa;
  font-family: 'Fredoka', 'Segoe UI', sans-serif;
}

.lp-app {
  display: flex;
  align-items: flex-start;
  min-height: 100vh;

  &__main {
    min-width: 0;
    flex: 1;
    padding: 0; 
    transition: margin-left 0.25s ease;
    padding: 15px;
  }
}
</style>
