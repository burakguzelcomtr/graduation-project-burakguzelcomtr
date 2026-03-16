<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const showSidebar = computed(() => route.path !== '/')
</script>

<template>
  <div class="app-layout"> 
    <!-- hide this if on home page -->
    
    <Sidebar v-if="showSidebar" />
    <main class="main-content">
      <Suspense>
        <RouterView /> 
      </Suspense>
    </main>
  </div>
</template>

<style>
body {   margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
.app-layout { display: flex; min-height: 100vh; }
.main-content { flex: 1; padding: 1rem; background: #f5f7fa; }
</style>
