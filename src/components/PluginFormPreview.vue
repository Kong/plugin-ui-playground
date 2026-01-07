<template>
  <div class="form-preview">
    <div v-if="hasError" class="error-placeholder">
      <div class="error-icon">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-amber-500" />
      </div>
      <h3>Form Rendering Error</h3>
      <p>Unable to render this JSON Schema. Please check if the Schema is correct.</p>
      <UButton size="sm" color="primary" @click="resetError">
        Retry
      </UButton>
    </div>

    <component
      :is="ErrorBoundary"
      v-else
      @error-captured="handleError"
    >
      <PluginForm
        v-if="maybeSchemaJSON"
        :config="kongManagerConfig"
        enable-redis-partial
        enable-vault-secret-picker
        :engine="engine"
        :plugin-type="pluginName ?? 'acl'"
        :schema="maybeSchemaJSON"
        @update="onUpdate"
      />
      <div v-else class="empty-placeholder">
        <div class="empty-icon">
          <UIcon name="i-heroicons-document" class="text-gray-400" />
        </div>
        <p>Please select a valid JSON Schema file</p>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
import '@kong-ui-public/entities-plugins/dist/style.css'
import { KongManagerPluginFormConfig, PluginForm } from '@kong-ui-public/entities-plugins'
import { computed, defineComponent, ref, watch } from 'vue'

const props = defineProps<{
  schema: string
  pluginName?: string
  engine: 'vfg' | 'freeform'
}>()

const hasError = ref(false)
const errorMessage = ref('')

const kongManagerConfig: KongManagerPluginFormConfig = {
  app: 'kongManager',
  workspace: 'default',
  apiBaseUrl: '/kong-manager', // For local dev server proxy
  cancelRoute: { name: 'list-plugin' },
}

const onUpdate = (payload: Record<string, any>) => {
  console.log('update', payload)
}

// Error boundary component
const ErrorBoundary = defineComponent({
  setup(_, { slots }) {
    return () => {
      return slots.default?.()
    }
  },
  errorCaptured(err) {
    this.$emit('error-captured', err)
    return false // Prevent error from propagating
  }
})

// Handle error
const handleError = (err: Error) => {
  console.error('rendering error:', err)
  hasError.value = true
  errorMessage.value = err.message
}

// Reset error state
const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const maybeSchemaJSON = computed(() => {
  if (!props.schema) return null
  try {
    return JSON.parse(props.schema)
  } catch (e) {
    console.error('Invalid JSON:', e)
    return null
  }
})

watch(maybeSchemaJSON, () => {
  resetError()
})
</script>

<style scoped lang="scss">
.form-preview {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.error-placeholder,
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  height: 100%;
  min-height: 200px;
  color: #666;
  flex: 1;
}

.error-placeholder {
  background-color: #fff9eb;
  border: 1px dashed #ffc107;
  border-radius: 8px;
}

.error-icon,
.empty-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.error-placeholder h3 {
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 18px;
  color: #92400e;
}

.error-placeholder p,
.empty-placeholder p {
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
}

// Responsive design
@media (max-width: 768px) {
  .form-preview {
    padding: 16px;
  }

  .error-placeholder,
  .empty-placeholder {
    padding: 32px 16px;
    min-height: 160px;
  }

  .error-icon,
  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .error-placeholder h3 {
    font-size: 16px;
  }

  .error-placeholder p,
  .empty-placeholder p {
    font-size: 13px;
  }
}
</style>
