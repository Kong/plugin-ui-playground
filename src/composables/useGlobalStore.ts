import { SelectItem } from '@kong/kongponents'
import { reactive, toRefs } from 'vue'

// Global application state interface
export interface AppState {
  schema: string

  selectedPluginName?: string

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
  selectedPluginName: undefined, // 明确设置为 undefined，确保 toRefs 能创建 ref
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

  // Update selected plugin name
  updateSelectedPluginName: (pluginName: string | undefined) => {
    state.selectedPluginName = pluginName
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
  async loadSchemaFile(path: string): Promise<any> {
    try {
      console.log('Selected path:', path)

      try {
        let modules
        modules = import.meta.glob(`../../schemas/**/*.json`, { eager: true })

        // 更严谨的路径匹配：确保路径以指定名称结尾
        const normalizedPath = path.endsWith('.json') ? path : `${path}.json`
        const jsonData: any = Object.keys(modules)
          .filter(key => {
            // 提取文件名进行精确匹配
            const fileName = key.split('/').pop() || ''
            return fileName === normalizedPath
          })
          .map(key => modules[key])[0]

        return JSON.stringify(jsonData.default, null, 2)
      } catch (importError) {
        console.error('Failed:', importError)
      }
    } catch (error) {
      console.error('Failed:', error)
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
    if (snapshot.selectedPluginName !== undefined) {
      state.selectedPluginName = snapshot.selectedPluginName
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
