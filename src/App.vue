<template>
  <UApp>
    <div class="app-container">
      <!-- Header Control Area -->
      <PlaygroundHeader />

      <!-- Main Content Area with Resizable Panels -->
      <ResizablePanes class="main-content">
        <template #editor>
          <CodeEditor v-model="schema" />
        </template>

        <template #preview>
          <PreviewArea />
        </template>
      </ResizablePanes>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from './composables/useGlobalStore'
import { useUrlSync } from './composables/useUrlSync'
import PlaygroundHeader from './components/PlaygroundHeader.vue'
import ResizablePanes from './components/ResizablePanes.vue'
import PreviewArea from './components/PreviewArea.vue'
import CodeEditor from './CodeEditor.vue'

// Initialize global store and URL sync
const store = useGlobalStore()
useUrlSync()

// Computed property for schema with two-way binding to store
const schema = computed({
  get: () => store.schema.value,
  set: (value: string) => store.updateSchema(value),
})
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

// Global app styles
:global(body) {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
