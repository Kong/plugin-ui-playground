<template>
  <div class="playground-header">
    <div class="header-left">
      <SchemaSelector />
    </div>

    <div class="header-center">
      <EngineControls />
    </div>

    <div class="header-right">
      <GitHubButton />
      <ShareButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemaSelector from './SchemaSelector.vue'
import EngineControls from './EngineControls.vue'
import GitHubButton from './GitHubButton.vue'
import ShareButton from './ShareButton.vue'
</script>

<style scoped lang="scss">
.playground-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  gap: 20px;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left {
  flex: 1;
  justify-content: flex-start;
}

.header-center {
  flex: 1;
  justify-content: center;
}

.header-right {
  flex: 1;
  justify-content: flex-end;
}

// Responsive design
@media (max-width: 1200px) {
  .playground-header {
    padding: 0 16px;
    height: 56px;
  }

  .header-left,
  .header-center,
  .header-right {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .playground-header {
    padding: 0 12px;
    height: 52px;
  }

  .header-center {
    flex: 0.8;
  }

  .header-left,
  .header-right {
    flex: 0.6;
  }
}
</style>
