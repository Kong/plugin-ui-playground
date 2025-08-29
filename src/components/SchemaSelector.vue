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
import { onMounted, computed, ref, watch } from 'vue';
import { store } from '../composables/useGlobalStore';
import fileIndex from '../file-index';
import { SelectItem } from '@kong/kongponents';

// Keep track of the originally loaded schema content for comparison
const originalSchemaContent = ref<string>('');
const selectedFileName = ref<string>('');

// Reactive state
const selectedFile = computed({
  get: () => {
    // Return the currently selected file name or empty if schema was manually edited
    const currentPluginName = store.state.selectedPluginName?.value;
    if (currentPluginName && !isSchemaManuallyEdited()) {
      return currentPluginName;
    }
    return '';
  },
  set: (value: string) => {
    if (value) {
      handleSchemaChange(value);
    }
  }
});

const schemaOptions = computed(() => store.state.schemaOptions.value);
const isLoading = computed(() => store.state.isLoading.value);

// Helper function to extract plugin name from file path
const extractPluginName = (filePath: string): string => {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.json$/, '');
};

// Helper function to check if schema was manually edited
const isSchemaManuallyEdited = (): boolean => {
  const currentSchema = store.state.schema.value;
  return originalSchemaContent.value !== '' &&
         currentSchema !== originalSchemaContent.value;
};

// Watch for manual schema changes and clear selection if needed
watch(
  () => store.state.schema.value,
  (newSchema) => {
    if (originalSchemaContent.value && newSchema !== originalSchemaContent.value) {
      // Schema was manually edited, clear selection
      store.actions.updateSelectedPluginName(undefined);
      originalSchemaContent.value = '';
      selectedFileName.value = '';
    }
  }
);

const loadSchemaOptions = () => {
  // Convert file index structure to options
  const options: SelectItem[] = fileIndex.map(file => ({
    label: file,
    value: file,
  }));

  console.log('Schema options loaded:', options);
  store.actions.updateSchemaOptions(options)
};

const handleSchemaChange = async (value: string) => {
  console.log('Schema selected:', value);
  try {
    store.actions.setLoading(true);
    store.actions.clearError();

    const schema = await store.actions.loadSchemaFile(value);
    store.actions.updateSchema(schema);

    // Store the original content for comparison
    originalSchemaContent.value = schema;
    selectedFileName.value = value;

    // Extract plugin name and update store
    const pluginName = extractPluginName(value);
    store.actions.updateSelectedPluginName(pluginName);

  } catch (error) {
    console.error('Error loading schema:', error);
    store.actions.setError(error instanceof Error ? error.message : 'Load schema failed');
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
