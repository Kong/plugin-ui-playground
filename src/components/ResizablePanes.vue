<template>
  <div class="resizable-panes" ref="containerRef">
    <!-- Editor Pane -->
    <div
      class="editor-pane"
      :style="{ width: `${editorWidthPercent}%` }"
    >
      <slot name="editor" />
    </div>

    <!-- Resize Divider -->
    <div
      class="resize-divider"
      :class="{
        'dragging': isDragging,
        'hover': isHovering
      }"
      @mousedown="handleMouseDown"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @dblclick="handleDoubleClick"
      title="Drag to resize panels or double-click to reset"
    >
      <div class="divider-handle">
        <UIcon name="i-heroicons-arrows-pointing-in-out" class="handle-icon" />
      </div>
    </div>

    <!-- Preview Pane -->
    <div class="preview-pane">
      <slot name="preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGlobalStore } from '../composables/useGlobalStore'
import { throttle } from 'lodash-es'

const store = useGlobalStore()

// Component refs
const containerRef = ref<HTMLElement>()

// Local state
const isDragging = ref(false)
const isHovering = ref(false)
const dragStartX = ref(0)
const dragStartWidth = ref(0)

// Computed properties
const editorWidthPercent = computed(() => store.editorWidthPercent.value)

// Minimum and maximum width constraints (in percentage)
const MIN_WIDTH_PERCENT = 30
const MAX_WIDTH_PERCENT = 70

/**
 * Handle mouse down on resize divider
 * @param event - Mouse event
 */
function handleMouseDown(event: MouseEvent) {
  event.preventDefault()

  if (!containerRef.value) return

  // Set initial drag state
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartWidth.value = store.editorWidthPercent.value

  // Update global dragging state
  store.setDragging(true)

  // Add global styles to prevent text selection
  document.body.classList.add('dragging-resize')

  // Add global mouse event listeners
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // Prevent default drag behavior
  document.onselectstart = () => false
  document.ondragstart = () => false
}

/**
 * Handle mouse move during drag
 * Throttled to improve performance
 */
const handleMouseMove = throttle((event: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return

  // Calculate new width based on mouse movement
  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width
  const mouseDelta = event.clientX - dragStartX.value
  const pixelDelta = mouseDelta
  const percentDelta = (pixelDelta / containerWidth) * 100

  // Calculate new editor width percentage
  const newWidthPercent = dragStartWidth.value + percentDelta

  // Apply constraints
  const clampedWidth = Math.max(
    MIN_WIDTH_PERCENT,
    Math.min(MAX_WIDTH_PERCENT, newWidthPercent)
  )

  // Update store
  store.updateEditorWidth(clampedWidth)

}, 16) // ~60fps

/**
 * Handle mouse up to end drag
 */
function handleMouseUp() {
  if (!isDragging.value) return

  // Clean up drag state
  isDragging.value = false
  store.setDragging(false)

  // Remove global styles
  document.body.classList.remove('dragging-resize')

  // Remove global event listeners
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  // Restore default drag behavior
  document.onselectstart = null
  document.ondragstart = null

  // Trigger Monaco Editor resize if available
  triggerEditorResize()
}

/**
 * Handle double-click on divider to reset width
 */
function handleDoubleClick() {
  store.resetEditorWidth()
  triggerEditorResize()
}

/**
 * Trigger Monaco Editor resize
 * This ensures the editor adjusts to the new container size
 */
function triggerEditorResize() {
  // Wait for DOM update, then trigger editor resize
  setTimeout(() => {
    // Dispatch a resize event to notify Monaco Editor
    window.dispatchEvent(new Event('resize'))
  }, 50)
}

/**
 * Handle window resize to maintain proper proportions
 */
const handleWindowResize = throttle(() => {
  if (!isDragging.value) {
    triggerEditorResize()
  }
}, 100)

// Watch for editor width changes to trigger editor resize
watch(editorWidthPercent, () => {
  if (!isDragging.value) {
    triggerEditorResize()
  }
})

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleWindowResize)

  // Initial editor resize after mount
  setTimeout(triggerEditorResize, 100)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('resize', handleWindowResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  // Clean up drag state
  document.body.classList.remove('dragging-resize')
  document.onselectstart = null
  document.ondragstart = null
})
</script>

<style scoped lang="scss">
.resizable-panes {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.editor-pane {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;

  // Disable transition during dragging
  .dragging-resize & {
    transition: none;
  }
}

.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 30%;
}

.resize-divider {
  width: 6px;
  background-color: #e5e7eb;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &.hover {
    background-color: #3b82f6;
  }

  &.dragging {
    background-color: #2563eb;
  }

  // Show handle on hover
  &:hover .divider-handle {
    opacity: 1;
  }

  &.dragging .divider-handle {
    opacity: 1;
  }
}

.divider-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.handle-icon {
  color: #6b7280;
  transform: rotate(90deg);
}

// Global styles for dragging state
:global(.dragging-resize) {
  user-select: none !important;
  cursor: col-resize !important;
}

:global(.dragging-resize *) {
  pointer-events: none !important;
}

// Responsive design
@media (max-width: 1200px) {
  .resizable-panes {
    flex-direction: column;
  }

  .editor-pane {
    width: 100% !important;
    height: 40%;
    flex-shrink: 0;
  }

  .preview-pane {
    flex: 1;
    min-height: 60%;
  }

  .resize-divider {
    width: 100%;
    height: 6px;
    cursor: row-resize;

    .divider-handle {
      width: 40px;
      height: 20px;
    }

    .handle-icon {
      transform: rotate(0deg);
    }
  }
}

@media (max-width: 768px) {
  // Disable resizing on mobile
  .resize-divider {
    cursor: default;
    pointer-events: none;

    .divider-handle {
      display: none;
    }
  }
}
</style>
