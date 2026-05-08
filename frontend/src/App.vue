<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { ToastifyContainer } from 'vue3-toastify'
import Sidebar from './components/Sidebar.vue'
import ChatBox from './components/ChatBox.vue'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'

const route = useRoute()
const auth = useAuthStore()
const socketStore = useSocketStore()
const showSidebar = computed(() => route.path !== '/' && route.path !== '/login' && route.path !== '/404')
const showChatBox = computed(() => Boolean(auth.user) && route.path !== '/')

socketStore.init()

watch(
  () => auth.user,
  (user) => {
    if (user) {
      socketStore.connect()
      return
    }

    socketStore.disconnect()
  },
  { immediate: true },
)
</script>

<template lang="pug">
.lp-app
  Sidebar(v-if="showSidebar")
  main.lp-app__main
    Suspense
      RouterView
  ChatBox(v-if="showChatBox")
  ToastifyContainer(:limit="4" position="top-right" theme="light")
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

.Toastify__toast-container {
  z-index: 2000;
}

.Toastify__toast {
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}
</style>
