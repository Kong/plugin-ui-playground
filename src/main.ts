import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const app = createApp(App)
app.use(router)
app.use(Kongponents)
app.mount('#app')