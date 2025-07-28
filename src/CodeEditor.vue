<template>
  <div class="code-editor-container">
    <MonacoEditor
      :value="modelValue"
      @update:value="emit('update:modelValue', $event)"
      :language="language"
      :theme="theme"
      class="monaco-editor"
      :options="editorOptions"
      @editorDidMount="handleEditorDidMount"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import MonacoEditor from '@guolao/vue-monaco-editor'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'json'
  },
  theme: {
    type: String,
    default: 'vs'
  }
})

const emit = defineEmits(['update:modelValue'])

// Monaco Editor 配置选项
const editorOptions = {
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: 14,
  minimap: { enabled: false },
  scrollbar: {
    vertical: 'auto' as const,
    horizontal: 'auto' as const,
  },
  lineNumbers: 'on' as const,
  formatOnPaste: true,
  tabSize: 2,
}

// 编辑器初始化完成后的处理
const handleEditorDidMount = (editor: any) => {
  console.log('Editor mounted:', editor)
  // 让编辑器获取焦点
  editor.focus()
}
</script>

<style scoped lang="scss">
.code-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.monaco-editor {
  height: 100%;
  width: 100%;

  :deep(.monaco-editor) {
    height: 100% !important; // 强制高度为 100%
  }
}
</style>
