<script>
import { RouterView } from 'vue-router'
import { ToastifyContainer } from 'vue3-toastify'
import Sidebar from './components/Sidebar.vue'
import ChatBox from './components/ChatBox.vue'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'

export default {
  components: {
    RouterView,
    ToastifyContainer,
    Sidebar,
    ChatBox,
  },

  data() {
    return {
      auth: useAuthStore(),
      socketStore: useSocketStore(),
    }
  },

  computed: {
    showSidebar() {
      return this.$route.path !== '/' && this.$route.path !== '/login' && this.$route.path !== '/404'
    },

    showChatBox() {
      return Boolean(this.auth.user) && this.$route.path !== '/'
    },
    
    noPadding() {
      return this.$route.path === '/' || this.$route.path === '/login'
    },
  },

  watch: {
    'auth.user'(user) {
      this.syncSocketConnection(user)
    },
  },

  created() {
    this.socketStore.init()
    this.syncSocketConnection(this.auth.user)
  },

  methods: {
    syncSocketConnection(user) {
      if (user) {
        this.socketStore.connect()
        return
      }

      this.socketStore.disconnect()
    },
  },
}
</script>

<template lang="pug">
.lp-app(:class="{ 'lp-app--no-padding': noPadding }")
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
    padding: 15px;
    transition: margin-left 0.25s ease;
  }

  &--no-padding {
    .lp-app__main {
      padding: 0;
    }
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
