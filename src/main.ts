import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')

// 使用 Vite 的環境變數方式（推薦）
console.log("MODE:", import.meta.env.MODE)
console.log("DEV:", import.meta.env.DEV)
console.log("PROD:", import.meta.env.PROD)