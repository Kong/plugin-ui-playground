<template>
  <UTree
    :items="items"
    color="neutral"
    :default-value="defaultValue"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import fileIndex from './file-index'
import { TreeItem } from '@nuxt/ui'

const emit = defineEmits(['fileSelect'])
const defaultValue = ref('')

const items = computed(() => {
  const ret: TreeItem[] = fileIndex.map(group => {
    return {
      ...group,
      children: group.children.map(item => {
        // 为每个项目生成唯一的value，用于标识选中的节点
        const key = `${group.label}${item.label}`
        return {
          ...item,
          value: key, // 添加唯一value用于识别选中项
          onSelect: () => {
            emit('fileSelect', key)
          }
        }
      })
    }
  })

  ret[0].defaultExpanded = true // 默认展开第一个分组

  return ret
})

// 在组件挂载时选中第一个叶子节点
onMounted(() => {
  if (fileIndex[0] && fileIndex[0].children && fileIndex[0].children[0]) {
    const firstGroup = fileIndex[0]
    const firstItem = firstGroup.children[0]
    const key = `${firstGroup.label}${firstItem.label}`
    defaultValue.value = key
    emit('fileSelect', key)
  }
})
</script>
