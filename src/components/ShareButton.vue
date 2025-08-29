<template>
  <div class="share-button-container">
    <UButton
      :icon="shareIcon"
      :color="shareButtonColor"
      :variant="shareButtonVariant"
      size="sm"
      :loading="isSharing"
      @click="handleShare"
      :title="shareButtonTitle"
    >
      {{ shareButtonText }}
    </UButton>

    <!-- Success notification -->
    <div
      v-if="showSuccess"
      class="share-success-tooltip"
      :class="{ 'visible': showSuccess }"
    >
      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
      <span>Link copied!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalStore } from '../composables/useGlobalStore'
import { useUrlSync } from '../composables/useUrlSync'

const store = useGlobalStore()
const { copyShareUrl, getShareUrl } = useUrlSync()

// Component state
const isSharing = ref(false)
const showSuccess = ref(false)
const lastShareError = ref('')

// Computed properties
const hasContent = computed(() =>
  Boolean(store.schema.value.trim())
)

const shareIcon = computed(() => {
  if (showSuccess.value) return 'i-heroicons-check-circle'
  return 'i-heroicons-share'
})

const shareButtonColor = computed(() => {
  if (showSuccess.value) return 'success'
  return 'primary'
})

const shareButtonVariant = computed(() => {
  if (!hasContent.value) return 'soft'
  return 'solid'
})

const shareButtonText = computed(() => {
  if (showSuccess.value) return 'Copied!'
  if (!hasContent.value) return 'Share'
  return 'Share'
})

const shareButtonTitle = computed(() => {
  if (!hasContent.value) {
    return 'Add some content first to enable sharing'
  }
  return 'Copy share link to clipboard'
})

/**
 * Handle share button click
 */
async function handleShare() {
  if (!hasContent.value) {
    // Show warning for empty content
    alert('Please add some schema content before sharing.')
    return
  }

  try {
    isSharing.value = true
    lastShareError.value = ''

    // Copy share URL to clipboard
    const success = await copyShareUrl()

    if (success) {
      // Show success feedback
      showSuccess.value = true

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)

      // Update analytics or tracking if needed
      console.log('Share link copied:', getShareUrl())

    } else {
      throw new Error('Failed to copy to clipboard')
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to share'
    lastShareError.value = errorMessage
    console.error('Share error:', error)

    // Fallback: Show share URL in prompt for manual copy
    const shareUrl = getShareUrl()
    if (shareUrl) {
      prompt('Unable to copy automatically. Please copy this link manually:', shareUrl)
    } else {
      alert('Unable to generate share link. Please try again.')
    }

  } finally {
    isSharing.value = false
  }
}

/**
 * Manual reset of success state (for testing or external control)
 */
function resetSuccessState() {
  showSuccess.value = false
}

// Expose methods for parent component if needed
defineExpose({
  handleShare,
  resetSuccessState,
})
</script>

<style scoped lang="scss">
.share-button-container {
  position: relative;
  display: inline-block;
}

.share-success-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #065f46;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;

  // Tooltip arrow
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #065f46;
  }

  &.visible {
    opacity: 1;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .share-success-tooltip {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);

    &::after {
      display: none;
    }
  }
}
</style>
