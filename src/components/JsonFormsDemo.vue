<template>
  <div class="json-forms-demo">
    <div class="form-container">
      <json-forms
        :data="data"
        :schema="schema"
        :uischema="uischema"
        :renderers="Object.freeze(kongRenderers)"
        @change="onChange"
        validationMode="NoValidation"
      />
    </div>
    <div class="output-container">
      <h3>Form Output</h3>
      <pre class="output-data">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { JsonForms } from '@jsonforms/vue'
import { kongRenderers } from '../renderers'

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  uischema: {
    type: Object as any,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const data = ref(props.initialData)

const onChange = (event: any) => {
  data.value = event.data
}

onMounted(() => {
  // Initialize with initial data if provided
  data.value = props.initialData
})
</script>

<style scoped>
.json-forms-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-container {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}

.output-container {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #eee;
}

.output-data {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 14px;
  margin: 0;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>
