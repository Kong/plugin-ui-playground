<template>
  <div class="plugin-form">
    <h1>Plugin Form</h1>

    <div class="selector-container">
      <h2>Examples</h2>
      <KSelect
        v-model="selectedExample"
        :items="exampleOptions"
        placeholder="Select an example"
      />
    </div>

    <div class="columns">
      <div class="column">
        <h2>Plugin Schema</h2>
        <KTextArea
          placeholder="Enter Lua schema here"
          :rows="20"
          :character-limit="Infinity"
          v-model="schemaText"
        />
      </div>
      <div class="column">
        <h2>JSON Schema</h2>
        <KCodeBlock
          id="code-block-default"
          :code="jsonSchemaText"
          language="json"
          max-height="484"
          theme="dark"
        />
      </div>
      <div class="column">
        <h2>UI Schema</h2>
        <KTextArea
          placeholder="Enter ui schema here"
          :rows="20"
          :character-limit="Infinity"
          v-model="uiSchemaText"
        />
      </div>
    </div>

    <div class="demo-container">
      <h2>Demo</h2>
      <div class="demo-content">
        <JsonFormsDemo
          v-if="jsonSchemaText"
          :schema="JSON.parse(jsonSchemaText)"
          :uischema="{ type: 'Control', scope: '#' }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { examples } from '../schema-transformer/examples'
import { buildAnySchema } from '../schema-transformer/plugin-config-editor'
import JsonFormsDemo from '../components/JsonFormsDemo.vue'

const selectedExample = ref('')
const exampleOptions = Object.keys(examples).map((key) => ({
  value: key,
  label: `plugin - ${key}`,
}))
const schemaText = ref('')
const jsonSchemaText = computed(() => {
  if (!schemaText.value) {
    return ''
  }
  try {
    return JSON.stringify(buildAnySchema('', JSON.parse(schemaText.value), 'json'), null, 2)
  } catch (e) {
    console.error(e)
    return 'Parsing failed'
  }
})
const uiSchemaText = ref('')


watch(selectedExample, (value) => {
  if (value) {
    schemaText.value = JSON.stringify(examples[value as keyof typeof examples], null, 2)
  }
})

onMounted(() => {
  selectedExample.value = Object.keys(examples)[0]
})
</script>

<style scoped>
.plugin-form {
  padding: 20px;
}

.selector-container {
  margin-bottom: 20px;
  max-width: 300px;
}

.columns {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  overflow: hidden;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.demo-container {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
}

.demo-content {
  min-height: 200px;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.form-container {
  padding: 10px 0;
}
</style>
