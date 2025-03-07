/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import { createPinia } from 'pinia'

import router from "@/router/index.js";



const app = createApp(App)

registerPlugins(app)
app.use(createPinia)
app.use(router)

app.mount('#app')
