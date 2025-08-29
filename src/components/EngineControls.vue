<template>
  <div class="engine-controls">
    <div class="engine-control-group">
      <span class="control-label">Rendering Engines:</span>

      <div class="engine-toggles">
        <!-- FreeForm is always enabled -->
        <div class="engine-toggle">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
          <span class="engine-name">FreeForm</span>
          <span class="engine-status primary">Active</span>
        </div>

        <!-- VFG toggle -->
        <div class="engine-toggle">
          <USwitch
            v-model="vfgEnabled"
          />
          <span class="engine-name">VFG</span>
          <span
            :class="['engine-status', vfgEnabled ? 'active' : 'inactive']"
          >
            {{ vfgEnabled ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Layout mode indicator -->
    <!-- <div class="layout-indicator">
      <UIcon
        :name="vfgEnabled ? 'i-heroicons-squares-2x2' : 'i-heroicons-rectangle-stack'"
        class="layout-icon"
      />
      <span class="layout-mode">
        {{ vfgEnabled ? 'Comparing Both Engines' : 'Using FreeForm Only' }}
      </span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '../composables/useGlobalStore'

const store = useGlobalStore()

// Computed properties
const vfgEnabled = computed({
  get: () => store.enableVFG.value,
  set: (value: boolean) => {
    console.log('VFG toggle changed:', value) // Debug log
    store.setVFGEngine(value)
  },
})
</script>

<style scoped lang="scss">
.engine-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.engine-control-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.engine-toggles {
  display: flex;
  align-items: center;
  gap: 16px;
}

.engine-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
}

.engine-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 60px;
}

.engine-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.primary {
    background-color: #dbeafe;
    color: #1e40af;
  }

  &.active {
    background-color: #d1fae5;
    color: #065f46;
  }

  &.inactive {
    background-color: #f3f4f6;
    color: #6b7280;
  }
}

.layout-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.layout-icon {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.layout-mode {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

// Responsive design
@media (max-width: 1200px) {
  .engine-controls {
    gap: 12px;
  }

  .engine-control-group {
    gap: 8px;
  }

  .engine-toggles {
    gap: 12px;
  }

  .control-label {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .engine-controls {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .layout-indicator {
    align-self: stretch;
    justify-content: center;
  }

  .control-label {
    display: none; // Hide label on mobile to save space
  }
}
</style>
