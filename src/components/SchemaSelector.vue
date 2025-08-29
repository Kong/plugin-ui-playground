<template>
  <KSelect
    v-model="selectedFile"
    :items="schemaOptions"
    placeholder="Select a schema file..."
    class="w-60"
    :loading="isLoading"
    @update:model-value="v => handleFileSelect(v as string)"
  >
    <template #selected-item-template="{ item }">
      <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
      {{ item?.label }}
    </template>
  </KSelect>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { store } from '../composables/useGlobalStore';
import fileIndex from '../file-index';
import { SelectItem } from '@kong/kongponents';

// Reactive state
const selectedFile = computed({
  get: () => store.state.schema.value ? 'current' : '',
  set: (value: string) => {
    if (value) {
      handleSchemaChange(value);
    }
  }
});

const schemaOptions = computed(() => store.state.schemaOptions.value);
const isLoading = computed(() => store.state.isLoading.value);

const loadSchemaOptions = () => {
  // Convert file index structure to options
  const options: SelectItem[] = fileIndex.reduce((acc, category) => {
    const categoryOptions = category.children.map((child) => ({
      label: child.label,
      value: child.label,
      group: category.label,
    }));
    return [...acc, ...categoryOptions];
  }, [] as SelectItem[]);

  console.log('Schema options loaded:', options);
  store.actions.updateSchemaOptions(options)
};

const handleSchemaChange = async (value: string) => {
  console.log('Schema selected:', value);
  try {
    store.actions.setLoading(true);
    store.actions.clearError();

    try {
      const schema = await store.actions.loadSchemaFile(`basic/${value}`);
      store.actions.updateSchema(JSON.stringify(schema, null, 2));
    } catch {
      const schema = await store.actions.loadSchemaFile(`plugins/${value}`);
      store.actions.updateSchema(JSON.stringify(schema, null, 2));
    }
  } catch (error) {
    console.error('Error loading schema:', error);
    store.actions.setError(error instanceof Error ? error.message : '加载模式失败');
  } finally {
    store.actions.setLoading(false);
  }
};

const handleFileSelect = (value: string) => {
  console.log('File selected:', value);
  handleSchemaChange(value);
};

onMounted(() => {
  loadSchemaOptions();
});
</script>

<style scoped lang="scss">
.debug-info {
  position: absolute;
  top: 100%;
  left: 0;
  background: #1f2937;
  color: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  z-index: 1000;
  min-width: 200px;

  ul {
    margin: 4px 0 0 0;
    padding-left: 16px;
  }

  li {
    margin: 2px 0;
  }
}
</style>
