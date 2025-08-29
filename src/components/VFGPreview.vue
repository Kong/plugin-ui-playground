<template>
  <div class="vfg-preview">
    <div class="coming-soon-placeholder">
      <div class="coming-soon-icon">
        <UIcon name="i-heroicons-wrench-screwdriver" class="text-purple-500" />
      </div>
      <h3>VFG Engine</h3>
      <p>Vue Form Generator integration coming soon!</p>
      <div class="feature-list">
        <div class="feature-item">
          <UIcon name="i-heroicons-check-circle" class="feature-icon text-green-500" />
          <span>Schema validation</span>
        </div>
        <div class="feature-item">
          <UIcon name="i-heroicons-check-circle" class="feature-icon text-green-500" />
          <span>Custom field types</span>
        </div>
        <div class="feature-item">
          <UIcon name="i-heroicons-clock" class="feature-icon text-yellow-500" />
          <span>Side-by-side comparison</span>
        </div>
      </div>

      <!-- Temporary development info -->
      <div v-if="isDevelopment" class="dev-info">
        <h4>Development Info</h4>
        <pre>{{ formattedSchema }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  schema: string
}>()

// Check if running in development mode
const isDevelopment = computed(() => import.meta.env.DEV)

// Parse and format schema for development display
const formattedSchema = computed(() => {
  if (!props.schema) return 'No schema provided'

  try {
    const parsed = JSON.parse(props.schema)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`
  }
})

// TODO: Implement VFG integration
// This component is a placeholder for future Vue Form Generator integration
// Key features to implement:
// 1. Schema transformation from FreeForm format to VFG format
// 2. VFG form rendering
// 3. Event handling and validation
// 4. Error boundary similar to FreeFormPreview
</script>

<style scoped lang="scss">
.vfg-preview {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.coming-soon-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  height: 100%;
  min-height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  position: relative;
  flex: 1;
}

.coming-soon-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
}

h3 {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 24px;
  color: #374151;
  background: linear-gradient(45deg, #7c3aed, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p {
  margin-bottom: 24px;
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
}

.feature-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dev-info {
  margin-top: 24px;
  padding: 16px;
  background-color: rgba(31, 41, 55, 0.05);
  border-radius: 8px;
  text-align: left;
  width: 100%;
  max-width: 500px;

  h4 {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  pre {
    font-size: 12px;
    color: #6b7280;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
}

// Responsive design
@media (max-width: 768px) {
  .vfg-preview {
    padding: 16px;
  }

  .coming-soon-placeholder {
    padding: 32px 16px;
    min-height: 160px;
  }

  .coming-soon-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .feature-item {
    font-size: 13px;
    padding: 6px 12px;
  }

  .dev-info {
    margin-top: 20px;
    padding: 12px;

    pre {
      font-size: 11px;
      max-height: 150px;
    }
  }
}
</style>
