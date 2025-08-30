import { onMounted, onUnmounted } from 'vue'
import { useGlobalStore } from './useGlobalStore'
import { compressState, decompressState, isUrlTooLong } from '../utils/compression'

/**
 * Composable for handling URL state synchronization
 * Provides URL state loading and share functionality
 */
export function useUrlSync() {
  const store = useGlobalStore()

  /**
   * Generate compressed share URL with current state
   * @returns Generated share URL or null if failed
   */
  function generateShareUrl(): string | null {
    try {
      // Only include schema content in share URL
      const stateSnapshot = {
        selectedSchema: store.schema.value
      }

      // Skip if state is empty
      if (!stateSnapshot.selectedSchema) {
        return null
      }

      // Compress state
      const compressedData = compressState(stateSnapshot)

      // Check if URL would be too long
      if (isUrlTooLong(compressedData)) {
        console.warn('URL too long, cannot generate share URL')
        return null
      }

      // Generate share URL
      const shareUrl = `${window.location.origin}${window.location.pathname}#${compressedData}`
      return shareUrl

    } catch (error) {
      console.error('Failed to generate share URL:', error)
      return null
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
  }

  /**
   * Get current share URL
   * @returns Current share URL or empty string if none
   */
  function getShareUrl(): string {
    return generateShareUrl() || ''
  }

  /**
   * Copy share URL to clipboard
   * Generates a new share URL with compressed state on demand
   * @returns Promise that resolves when copy is complete
   */
  async function copyShareUrl(): Promise<boolean> {
    try {
      // Generate fresh share URL with current state
      const shareUrl = generateShareUrl()

      if (!shareUrl) {
        console.warn('Cannot generate share URL - state may be empty or too large')
        return false
      }

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

      console.log('Share URL copied to clipboard:', shareUrl)
      return true
    } catch (error) {
      console.error('Failed to copy share URL:', error)
      return false
    }
  }

  // Set up URL state loading without real-time sync

  /**
   * Start URL synchronization
   * Only sets up URL state loading, no real-time sync
   */
  function startUrlSync() {
    // Listen for browser navigation events
    window.addEventListener('popstate', handlePopState)

    // Load initial state from URL first
    // Use nextTick to ensure store is ready
    setTimeout(() => {
      loadStateFromUrl()
    }, 0)
  }

  /**
   * Stop URL synchronization
   * Cleans up event listeners
   */
  function stopUrlSync() {
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
    // URL state loading
    loadStateFromUrl,
    clearUrlState,

    // Share functionality
    getShareUrl,
    copyShareUrl,
    generateShareUrl,

    // Lifecycle control
    startUrlSync,
    stopUrlSync,
  }
}
