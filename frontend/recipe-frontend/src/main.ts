import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'
import * as Quill from 'quill'

(window as any).Quill = Quill

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
