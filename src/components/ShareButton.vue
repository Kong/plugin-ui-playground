<template>
  <div class="share-button-container">
    <KTooltip
      :text="tooltipText"
      placement="top"
    >
      <template #default>
        <UButton
          :icon="shareIcon"
          :color="shareButtonColor"
          :variant="shareButtonVariant"
          size="sm"
          :loading="isSharing"
          @click="handleShare"
        >
          {{ shareButtonText }}
        </UButton>
      </template>
    </KTooltip>
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

const tooltipText = computed(() => {
  if (showSuccess.value) return 'Link copied!'
  if (!hasContent.value) return 'Add some content first to enable sharing'
  return 'Copy share link to clipboard'
})

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
</style>
