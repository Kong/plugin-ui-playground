import './style.css'
import '@kong/kongponents/dist/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import Kongponents from '@kong/kongponents'
import ui from '@nuxt/ui/vue-plugin'

const app = createApp(App)
app.use(Kongponents)
app.use(ui)

app.mount('#app')
