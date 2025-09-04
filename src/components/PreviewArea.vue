<template>
  <div class="preview-area">
    <!-- Preview layout based on engine settings -->
    <div
      class="preview-container"
      :class="{
        'single-engine': !enableVFG,
        'dual-engine': enableVFG
      }"
    >
      <!-- FreeForm Preview (always visible) -->
      <div class="preview-panel freeform-panel">
        <div class="preview-header">
          <div class="engine-title">
            <UIcon name="i-heroicons-cog-6-tooth" class="engine-icon" />
            <h3>FreeForm</h3>
          </div>
        </div>
        <div class="preview-content">
          <PluginFormPreview
            :key="schema"
            :schema="schema"
            engine="freeform"
            :plugin-name="selectedPluginName"
          />
        </div>
      </div>

      <!-- Divider (only shown in dual engine mode) -->
      <div v-if="enableVFG" class="preview-divider">
        <div class="divider-line"></div>
      </div>

      <!-- VFG Preview (conditional) -->
      <div v-if="enableVFG" class="preview-panel vfg-panel">
        <div class="preview-header">
          <div class="engine-title">
            <UIcon name="i-heroicons-squares-2x2" class="engine-icon" />
            <h3>VFG</h3>
          </div>
        </div>
        <div class="preview-content">
          <PluginFormPreview
            :key="schema"
            :schema="schema"
            engine="vfg"
            :plugin-name="selectedPluginName"
          />
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-banner">
      <UIcon name="i-heroicons-exclamation-triangle" class="error-icon" />
      <span>{{ error }}</span>
      <UButton
        size="sm"
        variant="ghost"
        icon="i-heroicons-x-mark"
        @click="clearError"
        title="Dismiss error"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useGlobalStore } from '../composables/useGlobalStore'
import PluginFormPreview from './PluginFormPreview.vue'
import { FEATURE_FLAGS, TOASTER_PROVIDER, useProvideExperimentalFreeForms } from '@kong-ui-public/entities-plugins'
import { ToastManager } from '@kong/kongponents'

const store = useGlobalStore()

// Computed properties
const enableVFG = computed(() => store.enableVFG.value)
const schema = computed(() => store.schema.value)
const error = computed(() => store.error.value)
const selectedPluginName = computed(() => store.selectedPluginName?.value)

const toaster = new ToastManager()
provide(FEATURE_FLAGS.DATAKIT_ENABLE_FLOW_EDITOR, true)
provide(TOASTER_PROVIDER, toaster.open.bind(toaster))

useProvideExperimentalFreeForms([
  'service-protection',
])

/**
 * Clear error message
 */
function clearError() {
  store.clearError()
}
</script>

<style scoped lang="scss">
.preview-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8fafc;
  position: relative;
}

.preview-container {
  flex: 1;
  display: flex;
  overflow: hidden;

  &.single-engine {
    .freeform-panel {
      width: 100%;
    }
  }

  &.dual-engine {
    .freeform-panel,
    .vfg-panel {
      flex: 1;
    }
  }
}

.preview-panel {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &.freeform-panel {
    border-left: 3px solid #3b82f6;
  }

  &.vfg-panel {
    border-left: 3px solid #7c3aed;
  }
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.engine-title {
  display: flex;
  align-items: center;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
}

.engine-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.engine-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.primary {
    background-color: #dbeafe;
    color: #1e40af;
  }

  &.secondary {
    background-color: #f3e8ff;
    color: #7c3aed;
  }
}

.preview-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

.preview-divider {
  width: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
  flex-shrink: 0;
  position: relative;

  .divider-line {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #e5e7eb, #d1d5db, #e5e7eb);
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fef3cd;
  border: 1px solid #fde047;
  border-radius: 6px;
  margin: 16px;
  color: #92400e;
  font-size: 14px;

  .error-icon {
    width: 16px;
    height: 16px;
    color: #d97706;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
}

// Responsive design
@media (max-width: 1200px) {
  .preview-container {
    &.dual-engine {
      flex-direction: column;

      .preview-panel {
        margin: 8px 16px;
      }

      .preview-divider {
        height: 1px;
        width: calc(100% - 32px);
        margin: 0 16px;
        align-self: center;

        .divider-line {
          background: linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb);
        }
      }
    }
  }

  .preview-panel {
    margin: 8px 12px;
  }

  .error-banner {
    margin: 12px;
  }
}

@media (max-width: 768px) {
  .preview-panel {
    margin: 8px;
  }

  .preview-header {
    padding: 8px 12px;

    .engine-title h3 {
      font-size: 14px;
    }

    .engine-icon {
      width: 16px;
      height: 16px;
    }
  }

  .error-banner {
    margin: 8px;
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
