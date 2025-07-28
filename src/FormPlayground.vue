<template>
  <div class="playground-container">
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
      <Form
        v-if="maybeSchemaJSON"
        :key="code"
        :schema="(maybeSchemaJSON as any)"
        class="form"
        @change="v => console.log(JSON.parse(JSON.stringify(v)))"
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
import { FreeForm } from '@kong-ui-public/entities-plugins'
import { computed, defineComponent, ref, watch } from 'vue';
const { Form } = FreeForm

const props = defineProps<{
  code: string
}>()

const hasError = ref(false)
const errorMessage = ref('')

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
  console.error('Form rendering error:', err)
  hasError.value = true
  errorMessage.value = err.message
}

// Reset error state
const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const maybeSchemaJSON = computed(() => {
  if (!props.code) return null
  try {
    return JSON.parse(props.code)
  } catch (e) {
    console.error('Invalid JSON:', e)
    return null
  }
})

watch(maybeSchemaJSON, () => {
  hasError.value = false
})
</script>

<style scoped lang="scss">
.playground-container {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 0 auto;
  width: 600px;
  max-width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
}

.error-placeholder {
  background-color: #fff9eb;
  border: 1px dashed #ffc107;
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
}

.error-placeholder p,
.empty-placeholder p {
  margin-bottom: 16px;
}
</style>
