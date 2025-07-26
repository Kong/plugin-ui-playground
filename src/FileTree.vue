<template>
  <UTree :items="items" color="neutral" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'app/',
    defaultExpanded: true,
    children: [
      {
        label: 'composables/',
        children: [
          {
            label: 'useAuth.ts',
          },
          {
            label: 'useUser.ts',
          }
        ]
      },
      {
        label: 'components/',
        defaultExpanded: true,
        children: [
          {
            label: 'Card.vue',
          },
          {
            label: 'Button.vue',
          }
        ]
      }
    ]
  },
  {
    label: 'app.vue',
    icon: 'i-vscode-icons-file-type-vue'
  },
  {
    label: 'nuxt.config.ts',
    icon: 'i-vscode-icons-file-type-nuxt'
  }
])
</script>
