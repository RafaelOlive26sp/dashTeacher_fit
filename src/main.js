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

// Router
import router from "@/router/index.js";

// Cookies
import Cookies from 'js-cookie';

import { useAuthStore } from './stores/auth';



const app = createApp(App)

registerPlugins(app)

app.use(router)

app.use(Cookies)

const authStore = useAuthStore()

authStore.initializeAuth()

app.mount('#app')
