import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ui()],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        // Inject the @kong/design-tokens SCSS variables to make them available for all components.
        additionalData: '@use "@kong/design-tokens/tokens/scss/variables" as *;',
      },
    },
  },
})
