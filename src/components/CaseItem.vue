<template>
  <div :id="caseItem.name" class="case-item">
    <h2>{{ caseItem.name }}</h2>

    <KTabs :tabs="linkTabs">
      <template #demo>
        <JsonFormsDemo
          :schema="caseItem.schema"
          :uischema="caseItem.uischema"
          :initialData="caseItem.data"
        />
      </template>
      <template #ui-schema>
        <pre class="code-block">{{ JSON.stringify(caseItem.uischema, null, 2) }}</pre>
      </template>
      <template #schema>
        <pre class="code-block">{{ JSON.stringify(caseItem.schema, null, 2) }}</pre>
      </template>
    </KTabs>
  </div>
</template>

<script type="module" setup lang="ts">

import { PropType, ref } from 'vue';
import JsonFormsDemo from '../components/JsonFormsDemo.vue'
import type { Case } from '../types/case'
import { Tab } from '@kong/kongponents'

defineProps({
  caseItem: {
    type: Object as PropType<Case>,
    required: true
  },
})

const linkTabs = ref<Tab[]>([
  {
    hash: '#demo',
    title: 'Demo',
    to: '#tab-link-1'
  },
  {
    hash: '#ui-schema',
    title: 'UI-Schema',
    to: '#tab-link-2'
  },
  {
    hash: '#schema',
    title: 'Schema',
    to: '#tab-link-3'
  },
])
</script>

<style scoped>
.case-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-container {
  margin-top: 15px;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.tab-button {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  margin-right: 10px;
}

.tab-button:hover {
  color: #000;
}

.tab-button.active {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
}

.tab-content {
  padding: 10px 0;
}

.code-block {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 14px;
}
</style>
