import { gzipSync, gunzipSync, strToU8, strFromU8 } from 'fflate'

// States that should be synchronized to URL hash
interface UrlSyncState {
  selectedSchema: string
  enableVFG: boolean
  editorWidthPercent: number
}

/**
 * Compress application state to base64 string for URL hash
 * @param state - Application state object
 * @returns Compressed base64 string
 */
export function compressState(state: UrlSyncState): string {
  try {
    // Convert state to JSON string
    const stateString = JSON.stringify(state)

    // Convert string to Uint8Array
    const uint8Array = strToU8(stateString)

    // Compress using gzip
    const compressed = gzipSync(uint8Array)

    // Convert to base64 string for URL safety
    const base64String = strFromU8(compressed, true) // true for base64 encoding

    return base64String
  } catch (error) {
    console.error('Failed to compress state:', error)
    throw new Error('State compression failed')
  }
}

/**
 * Decompress base64 string back to application state
 * @param compressedData - Base64 compressed string
 * @returns Decompressed state object or null if failed
 */
export function decompressState(compressedData: string): UrlSyncState | null {
  try {
    // Convert base64 string back to Uint8Array
    const compressedArray = strToU8(compressedData, true) // true for base64 decoding

    // Decompress using gunzip
    const decompressed = gunzipSync(compressedArray)

    // Convert back to string
    const stateString = strFromU8(decompressed)

    // Parse JSON
    const state = JSON.parse(stateString) as UrlSyncState

    // Validate state structure
    if (!isValidStateStructure(state)) {
      console.warn('Invalid state structure after decompression')
      return null
    }

    return state
  } catch (error) {
    console.warn('Failed to decompress state:', error)
    return null
  }
}

/**
 * Validate if the decompressed state has valid structure
 * @param state - State object to validate
 * @returns True if state structure is valid
 */
function isValidStateStructure(state: any): state is UrlSyncState {
  if (!state || typeof state !== 'object') {
    return false
  }

  // Check required properties with correct types
  const hasValidCode = typeof state.code === 'string'
  const hasValidSelectedSchema = typeof state.selectedSchema === 'string'
  const hasValidEnableVFG = typeof state.enableVFG === 'boolean'
  const hasValidEditorWidth = typeof state.editorWidthPercent === 'number' &&
                             state.editorWidthPercent >= 30 &&
                             state.editorWidthPercent <= 70

  return hasValidCode && hasValidSelectedSchema && hasValidEnableVFG && hasValidEditorWidth
}

/**
 * Get the maximum safe URL length for current browser
 * Different browsers have different URL length limits
 * @returns Safe URL length limit
 */
export function getMaxUrlLength(): number {
  // Conservative estimate for cross-browser compatibility
  // IE has the smallest limit at around 2048 characters
  return 2000
}

/**
 * Check if compressed state would create a URL that's too long
 * @param compressedData - Compressed state data
 * @param baseUrl - Base URL (optional, defaults to current location)
 * @returns True if URL would be too long
 */
export function isUrlTooLong(compressedData: string, baseUrl?: string): boolean {
  const base = baseUrl || window.location.origin + window.location.pathname
  const fullUrl = `${base}#${compressedData}`
  return fullUrl.length > getMaxUrlLength()
}

/**
 * Create a simplified state for sharing when full state creates URLs that are too long
 * @param state - Full application state
 * @returns Simplified state with only essential properties
 */
export function createSimplifiedState(state: UrlSyncState): Partial<UrlSyncState> {
  // For long URLs, only include essential states
  return {
    enableVFG: state.enableVFG,
    // Exclude selectedSchema and editorWidthPercent to reduce size
  }
}

/**
 * Estimate compression ratio for given state
 * Useful for determining if compression is worth it
 * @param state - State object to estimate
 * @returns Estimated compression ratio (0-1, lower is better compression)
 */
export function estimateCompressionRatio(state: UrlSyncState): number {
  try {
    const originalSize = JSON.stringify(state).length
    const compressedSize = compressState(state).length
    return compressedSize / originalSize
  } catch (error) {
    // If compression fails, return 1 (no compression benefit)
    return 1
  }
}
