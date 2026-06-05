import { fileURLToPath, URL } from 'node:url'
import process from 'node:process' 
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000'
const allowedHosts = ['learnpass-frontend-623667359622.europe-west1.run.app', 'all']
const proxy = {
  '/api': {
    target: apiProxyTarget,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/socket.io': {
    target: apiProxyTarget,
    changeOrigin: true,
    ws: true,
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    allowedHosts,
    ...(mode === 'development' ? { watch: {
      usePolling: true
    } } : {}),
    proxy,
  },
  preview: {
    host: true,
    allowedHosts,
    proxy,
  },
}))
