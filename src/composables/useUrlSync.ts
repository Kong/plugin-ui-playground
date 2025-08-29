import { watchEffect, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useGlobalStore } from './useGlobalStore'
import { compressState, decompressState, isUrlTooLong, createSimplifiedState } from '../utils/compression'

/**
 * Composable for handling URL state synchronization
 * Provides bidirectional sync between global store and URL hash
 */
export function useUrlSync() {
  const store = useGlobalStore()

  // Debounced function to sync state to URL hash
  // 500ms delay to avoid excessive URL updates during rapid state changes
  const debouncedSyncToUrl = debounce(() => {
    syncStateToUrl()
  }, 500)

  /**
   * Sync current application state to URL hash
   */
  function syncStateToUrl() {
    try {
      // Get current state snapshot for URL sync
      const stateSnapshot = store.getStateSnapshot()

      // Skip sync if state is empty (initial load)
      if (!stateSnapshot.selectedSchema) {
        return
      }

      // Compress state
      let compressedData = compressState(stateSnapshot)

      // Check if URL would be too long
      if (isUrlTooLong(compressedData)) {
        console.warn('URL too long, using simplified state for sharing')
        // Try with simplified state
        const simplifiedState = createSimplifiedState(stateSnapshot)
        compressedData = compressState(simplifiedState as any)

        // If still too long, skip URL update
        if (isUrlTooLong(compressedData)) {
          console.error('URL still too long even with simplified state')
          return
        }
      }

      // Update URL hash without triggering navigation
      const newUrl = `${window.location.pathname}#${compressedData}`
      window.history.replaceState(null, '', newUrl)

      // Update share URL in store
      store.updateShareUrl(window.location.href)

    } catch (error) {
      console.error('Failed to sync state to URL:', error)
    }
  }

  /**
   * Load state from URL hash on page load/navigation
   */
  function loadStateFromUrl() {
    try {
      const hash = window.location.hash.slice(1) // Remove # prefix

      if (!hash) {
        return // No state in URL
      }

      // Decompress state from URL
      const decompressedState = decompressState(hash)

      if (decompressedState) {
        // Restore state to store
        store.restoreState(decompressedState)
        console.log('State loaded from URL:', decompressedState)
      } else {
        console.warn('Failed to load state from URL hash')
        // Clean invalid hash
        window.history.replaceState(null, '', window.location.pathname)
      }

    } catch (error) {
      console.error('Failed to load state from URL:', error)
      // Clean corrupted hash
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  /**
   * Handle browser back/forward navigation
   */
  function handlePopState() {
    loadStateFromUrl()
  }

  /**
   * Clear URL hash and reset to clean state
   */
  function clearUrlState() {
    window.history.replaceState(null, '', window.location.pathname)
    store.updateShareUrl('')
  }

  /**
   * Get current share URL
   * @returns Current share URL or empty string if none
   */
  function getShareUrl(): string {
    return window.location.href
  }

  /**
   * Copy share URL to clipboard
   * @returns Promise that resolves when copy is complete
   */
  async function copyShareUrl(): Promise<boolean> {
    try {
      const shareUrl = getShareUrl()

      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API if available
        await navigator.clipboard.writeText(shareUrl)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      return true
    } catch (error) {
      console.error('Failed to copy share URL:', error)
      return false
    }
  }

  // Set up reactive watching for state changes
  let unwatchStateChanges: (() => void) | null = null

  /**
   * Start URL synchronization
   * Sets up watchers and event listeners
   */
  function startUrlSync() {
    // Watch for state changes and sync to URL
    unwatchStateChanges = watchEffect(() => {
      // Watch relevant state properties to trigger reactivity
      store.schema.value
      store.enableVFG.value
      store.editorWidthPercent.value

      // Trigger debounced URL sync
      debouncedSyncToUrl()
    })

    // Listen for browser navigation events
    window.addEventListener('popstate', handlePopState)

    // Load initial state from URL
    loadStateFromUrl()
  }

  /**
   * Stop URL synchronization
   * Cleans up watchers and event listeners
   */
  function stopUrlSync() {
    if (unwatchStateChanges) {
      unwatchStateChanges()
      unwatchStateChanges = null
    }

    // Cancel pending debounced calls
    debouncedSyncToUrl.cancel()

    // Remove event listeners
    window.removeEventListener('popstate', handlePopState)
  }

  // Lifecycle hooks
  onMounted(() => {
    startUrlSync()
  })

  onUnmounted(() => {
    stopUrlSync()
  })

  // Return public API
  return {
    // Manual sync functions
    syncStateToUrl,
    loadStateFromUrl,
    clearUrlState,

    // Share functionality
    getShareUrl,
    copyShareUrl,

    // Lifecycle control
    startUrlSync,
    stopUrlSync,
  }
}
