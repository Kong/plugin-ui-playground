import { SelectItem } from '@kong/kongponents'
import { reactive, toRefs } from 'vue'

// Global application state interface
export interface AppState {
  schema: string

  // Engine settings
  enableVFG: boolean

  // Layout settings
  editorWidthPercent: number

  // File options
  schemaOptions: SelectItem[]

  // Share functionality
  shareUrl: string

  // Application status
  isLoading: boolean
  error: string | null
  isDragging: boolean
}

// Default state values
const defaultState: AppState = {
  schema: '',
  enableVFG: false,
  editorWidthPercent: 30,
  schemaOptions: [],
  shareUrl: '',
  isLoading: false,
  error: null,
  isDragging: false,
}

// Global state object
const state = reactive<AppState>({ ...defaultState })

// Action functions for state management
const actions = {

  // Update selected schema file
  updateSchema: (schema: string) => {
    state.schema = schema
  },

  // Toggle VFG engine status
  toggleVFGEngine: () => {
    state.enableVFG = !state.enableVFG
  },

  // Set VFG engine status
  setVFGEngine: (enabled: boolean) => {
    state.enableVFG = enabled
  },

  // Update editor width percentage
  updateEditorWidth: (percentage: number) => {
    // Ensure percentage is within valid range (30% - 70%)
    const clampedPercentage = Math.max(30, Math.min(70, percentage))
    state.editorWidthPercent = clampedPercentage
  },

  // Reset editor width to default
  resetEditorWidth: () => {
    state.editorWidthPercent = 50
  },

  // Update schema file options
  updateSchemaOptions: (options: SelectItem[]) => {
    state.schemaOptions = options
  },

  // Update share URL
  updateShareUrl: (url: string) => {
    state.shareUrl = url
  },

  // Set loading status
  setLoading: (loading: boolean) => {
    state.isLoading = loading
  },

  // Set error message
  setError: (error: string | null) => {
    state.error = error
  },

  // Clear error
  clearError: () => {
    state.error = null
  },

  // Set dragging status
  setDragging: (dragging: boolean) => {
    state.isDragging = dragging
  },

  // Load schema file content
  async loadSchemaFile(filePath: string): Promise<any> {
    try {
      console.log('Loading schema file:', filePath);

      // Use fetch to load the JSON file from public directory
      const response = await fetch(`/examples/${filePath}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }

      const schema = await response.json();
      console.log('Schema loaded successfully:', filePath);
      return schema;
    } catch (error) {
      console.error('Error loading schema file:', error);
      throw error;
    }
  },

  // Reset application state
  reset: () => {
    Object.assign(state, { ...defaultState })
  },

  // Get current state snapshot for URL sync
  getStateSnapshot: () => ({
    selectedSchema: state.schema,
    enableVFG: state.enableVFG,
    editorWidthPercent: state.editorWidthPercent,
  }),

  // Restore state from snapshot
  restoreState: (snapshot: Partial<AppState>) => {
    if (snapshot.schema !== undefined) {
      state.schema = snapshot.schema
    }
    if (snapshot.enableVFG !== undefined) {
      state.enableVFG = snapshot.enableVFG
    }
    if (snapshot.editorWidthPercent !== undefined) {
      // Ensure valid range
      const clampedPercentage = Math.max(30, Math.min(70, snapshot.editorWidthPercent))
      state.editorWidthPercent = clampedPercentage
    }
  },
}

// Main composable function
export function useGlobalStore() {
  return {
    // Reactive state references
    ...toRefs(state),
    // Action functions
    ...actions,
  }
}

// Export store instance for non-composition API usage
export const store = { state: toRefs(state), actions }
