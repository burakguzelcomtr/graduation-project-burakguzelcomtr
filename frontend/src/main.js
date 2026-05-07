import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/main.scss'
import 'bootstrap'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
