<template>
  <UApp>
    <div class="app-container">
      <!-- 左侧固定宽度侧边栏 -->
      <div class="sidebar">
        <div class="file-tree">
          <FileTree />
        </div>
      </div>

      <!-- 右侧弹性区域 -->
      <div class="content-area">
        <!-- Playground 区域 -->
        <div class="playground" :style="{ height: playgroundHeight }">
          <div class="playground-content">
            <FormPlayground />
          </div>
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FileTree from './FileTree.vue'
import FormPlayground from './FormPlayground.vue'

// 控制 output 区域的展开收起
const outputCollapsed = ref(true)

// 根据 output 区域的状态动态计算 playground 高度
const playgroundHeight = computed(() => {
  return outputCollapsed.value ? 'calc(100% - 40px)' : 'calc(70%)'
})

</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  // background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-tree {
  flex: 1;
  padding: 16px;
  overflow-y: auto;

  .file-item {
    padding: 4px 0;
    cursor: pointer;

    &:hover {
      color: #1976d2;
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.playground {
  position: relative;
  overflow: hidden;
  background-image:
    linear-gradient(to right, #d9dee7 1px, transparent 1px),
    linear-gradient(to bottom, #d9dee7 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #eaedf4;
  transition: height 0.3s ease;
}

.playground-content {
  padding: 20px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.dummy-content-container {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.wide-content {
  width: 2000px;
  background-color: #f0f0f0;
  padding: 10px;
  margin-top: 20px;
}

.dummy-content {
  padding: 8px;
  margin: 4px 0;
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
