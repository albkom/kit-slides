import { createApp } from 'vue'
import '../../src/styles/main.scss'
// theme.css (next to this file) is auto-injected by vite.config.js — no import needed
import App from './App.vue'

createApp(App).mount('#app')
