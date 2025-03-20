<template>
  <div class="schema-transformer">
    <h1>Schema Transformer</h1>
    <div class="examples">
      <h2>Examples</h2>
      <KSelect v-model="example" :items="selectItems" />
    </div>
    <div class="playground">
      <div>
        <h2>Lua Schema</h2>
        <KTextArea
          placeholder="Enter Lua schema here"
          :rows="20"
          :character-limit="Infinity"
          v-model="luaSchema"
        />
      </div>

      <div>
        <h2>JSON Schema</h2>
        <KCodeBlock
          id="code-block-default"
          :code="jsonSchema"
          language="json"
          max-height="484"
          theme="dark"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KTextArea, KSelect, KCodeBlock } from '@kong/kongponents'
import type { SelectItem } from '@kong/kongponents'
import { buildAnySchema } from '../schema-transformer/plugin-config-editor'
import { examples } from '../schema-transformer/examples'

import { ref, computed, watch, onMounted } from 'vue'

const example = ref('')
const luaSchema = ref('')
const jsonSchema = computed(() => {
  if (!luaSchema.value) {
    return ''
  }
  try {
    return JSON.stringify(buildAnySchema('', JSON.parse(luaSchema.value), 'json'), null, 2)
  } catch (e) {
    console.error(e)
    return 'Parsing failed'
  }
})
const selectItems: SelectItem[] = Object.keys(examples).map((key) => ({
  value: key,
  label: `plugin - ${key}`,
}))

watch(example, (value) => {
  if (value) {
    luaSchema.value = JSON.stringify(examples[value as keyof typeof examples], null, 2)
  }
})

onMounted(() => {
  example.value = Object.keys(examples)[0]
})
</script>

<style scoped>
.schema-transformer {
  padding: 20px;
}

.playground {
  display: flex;
  gap: 20px;

  > div {
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
  }
}

.examples {
  width: 300px;
  margin-bottom: 30px
}

</style>
