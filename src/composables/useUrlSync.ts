import { watchEffect, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useGlobalStore } from './useGlobalStore'
import { compressState, decompressState, isUrlTooLong } from '../utils/compression'

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
      // Only sync schema content
      const stateSnapshot = {
        selectedSchema: store.schema.value
      }

      // Skip sync if state is empty (initial load)
      if (!stateSnapshot.selectedSchema) {
        return
      }

      // Compress state
      let compressedData = compressState(stateSnapshot)

      // Check if URL would be too long
      if (isUrlTooLong(compressedData)) {
        console.warn('URL too long, skipping URL update')
        return
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
      console.log('Loading from URL hash:', hash ? 'Found hash' : 'No hash')

      if (!hash) {
        return // No state in URL
      }

      // Decompress state from URL
      const decompressedState = decompressState(hash)
      console.log('Decompressed state:', decompressedState)

      if (decompressedState && decompressedState.selectedSchema) {
        // Restore only schema to store
        store.updateSchema(decompressedState.selectedSchema)
        console.log('Schema loaded from URL and applied to store')
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
    // Listen for browser navigation events
    window.addEventListener('popstate', handlePopState)

    // Load initial state from URL first, before setting up watchers
    // Use nextTick to ensure store is ready
    setTimeout(() => {
      loadStateFromUrl()
    }, 0)

    // Then set up watchers for future changes
    setTimeout(() => {
      unwatchStateChanges = watchEffect(() => {
        // Watch only schema changes to trigger reactivity
        const currentSchema = store.schema.value

        // Only sync if schema has meaningful content and avoid infinite loops
        if (currentSchema && currentSchema.trim()) {
          debouncedSyncToUrl()
        }
      })
    }, 100) // Small delay to avoid initial sync conflicts
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
