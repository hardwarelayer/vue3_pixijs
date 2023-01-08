/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

// Composables
import { createApp } from 'vue'
import { createPinia } from "pinia";

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
  .use(ContextMenu)
  .use(createPinia());

registerPlugins(app)

app.mount('#app')
