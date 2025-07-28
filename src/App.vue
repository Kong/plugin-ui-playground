<template>
  <UApp>
    <div class="app-container">
      <!-- 左侧固定宽度侧边栏 -->
      <div class="sidebar">
        <div class="file-tree">
          <FileTree @file-select="handleFileSelect" />
        </div>
      </div>

      <!-- 右侧弹性区域 -->
      <div class="content-area">
        <!-- 内容区左右布局 -->
        <div class="content-layout">
          <!-- 左边代码编辑区域 -->
          <div class="code-editor">
            <CodeEditor v-model="code" />
          </div>

          <!-- 右边 Playground 区域 -->
          <div class="playground-container">
            <div class="playground">
              <div class="playground-content">
                <FormPlayground :code="code" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileTree from './FileTree.vue'
import FormPlayground from './FormPlayground.vue'
import CodeEditor from './CodeEditor.vue'

// 编辑器值
const code = ref('')

// 处理文件选择事件
const handleFileSelect = async (path: string) => {
  try {
    console.log('Selected path:', path)

    try {
      // 动态导入JSON文件
      let modules
      modules = import.meta.glob(`../examples/**/*.json`, { eager: true })
      const jsonData: any = Object.keys(modules)
        .filter(key => key.includes(path))
        .map(key => modules[key])[0]

      // 更新编辑器中的内容和选中的schema
      code.value = JSON.stringify(jsonData.default, null, 2)
    } catch (importError) {
      console.error('动态导入失败:', importError)
    }

  } catch (error) {
    console.error('加载文件失败:', error)
  }
}

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

// 新增左右布局
.content-layout {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

// 左侧代码编辑区域
.code-editor {
  width: 45%;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// Monaco Editor 样式已移至 CodeEditor.vue

// 右侧 Playground 容器
.playground-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
