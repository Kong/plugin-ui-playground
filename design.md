Important! Please write the code and the comments in English!!!

## Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Vue 3 Composition API (reactive + ref), creating a global single Store pattern
- **Compression Tool**: fflate library's gzip compression feature, for URL hash data compression
- **UI Component Library**: @nuxt/ui + @kong/kongponents
- **Code Editor**: Monaco Editor (@guolao/vue-monaco-editor)
- **Form Rendering Engines**:
  - FreeForm (@kong-ui-public/entities-plugins) - Primary rendering engine
  - VFG (Vue Form Generator) - Comparison rendering engine

### Technical Selection Rationale
- **Not Using Pinia/Vuex**: Project scale is relatively small, using Composition API directly for state management is more concise
- **Reason for Choosing fflate**: Compact size (~10kb), good compression effect, suitable for URL data compression scenarios
- **Monaco Editor Integration**: Using @guolao/vue-monaco-editor wrapper, providing Vue 3 compatibility

> **Note: All text and code comments in this application must be written in English.**

## Project Overview

This project is a JSON Schema Playground for visually previewing and comparing different form rendering engines. Users can edit JSON Schema on the left, preview the form rendering effect in real-time on the right, and supports comparison of multiple rendering engines.

## Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Global Single Store ([vue use](https://vueuse.org/))
- **Compression Tool**: fflate (for URL hash compression/decompression)
- **UI Component Library**: @nuxt/ui + @kong/kongponents
- **Code Editor**: Monaco Editor (@guolao/vue-monaco-editor)
- **Form Rendering Engines**:
  - FreeForm (@kong-ui-public/entities-plugins)
  - VFG (Vue Form Generator, to be integrated)

## Overall Architecture Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│        Application Header Area (60px fixed height)          │
│    [Schema Selector] [Engine Switches] [Share] [Reset]      │
├─────────────────────────────┼───────────────────────────────┤
│                             ║                               │
│         Schema Editor       ║        Preview Area           │
│        (Monaco Editor)      ║                               │
│      Default 50% width,     ║    Default 50% width,         │
│         resizable           ║       responsive              │
│                             ║                               │
│                             ║  ┌─────────────────┐          │
│                             ║  │   FreeForm      │          │
│                             ║  │  (Single Mode)  │          │
│                             ║  │                 │          │
│                             ║  └─────────────────┘          │
│                             ║           or                  │
│                             ║  ┌─────────┬───────┐          │
│                             ║  │FreeForm │  VFG  │          │
│                             ║  │ (50%)   │ (50%) │          │
│                             ║  │         │       │          │
│                             ║  └─────────┴───────┘          │
└─────────────────────────────┺───────────────────────────────┘
           ↑ Drag Divider (6px width, col-resize cursor)
```

### Responsive Breakpoint Rules
- **Large Screen (>= 1440px)**: Side-by-side layout, editor default 50% width
- **Medium Screen (1200-1439px)**: Side-by-side layout, editor default 40% width
- **Small Screen (< 1200px)**: Top-bottom layout, editor height 40%, preview area 60%
- **Mobile Adaptation**: Disable drag adjustment, use fixed ratio layout

### Component Hierarchy

```
App.vue
├── PlaygroundHeader.vue (New: header control area)
│   ├── SchemaSelector.vue (Schema file selector)
│   ├── EngineControls.vue (Engine control switches)
│   └── ShareButton.vue (Share button)
├── ResizablePanes.vue (New: resizable panel container)
│   ├── CodeEditor.vue (Schema editor)
│   └── PreviewArea.vue (Preview area container)
│       ├── FreeFormPreview.vue (FreeForm preview component)
│       └── VFGPreview.vue (VFG preview component)
└── ResizeDivider.vue (New: drag divider component)
```

## Detailed Design

### 1. Layout Redesign

#### Main Application Layout (App.vue)
- **Adjustable Two-Column Layout**: Monaco Editor (default 50% width) + Preview Area (default 50% width)
- **Drag Adjustment**: Users can adjust the width ratio between editor and preview area by dragging the middle divider
- **Minimum Width Limit**: Editor minimum 30%, maximum 70%; Preview area minimum 30%, maximum 70%
- **Header Area**: Schema selector + Engine controls + Share button (60px height)
- **Single Mode**: Preview area fills the entire right side width
- **Dual Mode**: Preview area shows two engines in split columns

#### Responsive Design
- **Minimum Supported Width**: 1200px (switches to top-bottom layout below this width)
- **Drag Range Limit**: Editor width 30%-70%, corresponding pixel values 360px-840px (based on 1200px minimum width)
- **Mobile Adaptation**: Disable dragging below 768px, use preset ratio
- **Layout Switch Point**: 1200px is the breakpoint for side-by-side/top-bottom layout switch

### 2. Resizable Layout Design (ResizablePanes.vue)

#### Features
- **Drag Adjustment**: Adjust width of editor and preview area by dragging the middle divider
- **Ratio Limit**: Editor width range 30% - 70%, preview area automatically occupies remaining space
- **State Memory**: User-adjusted ratio is restored through URL state synchronization mechanism
- **Double-Click Reset**: Double-clicking the divider restores the default 50:50 ratio
- **Real-time Adjustment**: Update layout in real-time during dragging, Monaco Editor automatically adjusts size

#### Implementation Approach
- **Event Handling**: Monitor mousedown, mousemove, mouseup events to implement dragging
- **Style Control**: Use CSS custom property `--editor-width` to dynamically control width percentage
- **Boundary Limitation**: Math.max(30, Math.min(70, newPercentage)) to limit drag range
- **Double-Click Reset**: Reset to `--editor-width: 50%` when double-clicking the divider
- **Monaco Sync**: Call `editor.layout()` method to recalculate editor size after dragging ends
- **State Sync**: Synchronize to global Store via `updateEditorWidth(percentage)`

#### UI Implementation Details
- **Divider Style**: `width: 6px; cursor: col-resize; background: #e5e7eb; hover:background: #3b82f6`
- **Drag Feedback**: Add `user-select: none` to body during dragging, show blue divider
- **Animation Effect**: Use `transition: width 0.2s ease` for smooth transition in non-dragging state
- **Bidirectional Arrow Icon**: Use CSS pseudo-elements or SVG icons to display adjustment hints

#### UI Design
- Editor area: Dynamically adjust width based on user-set percentage
- Drag divider: 6px width, highlight on hover, containing bidirectional arrow icon
- Preview area: Automatically occupy remaining space
- Drag state: Provide visual feedback, show adjustment status

#### Style Design
- Use Flexbox layout to implement adjustable two-column structure
- Divider uses `col-resize` cursor, providing clear interaction cues
- Add global styles during dragging to prevent text selection and mouse event interference
- Transition animations make layout adjustments smoother and more natural

### 3. Header Control Area (PlaygroundHeader.vue)

#### Features
- **Schema File Selector**:
  - Dropdown selector, containing all available Schema files
  - Automatically loads file content to editor upon selection
- **Rendering Engine Selection**:
  - FreeForm (enabled by default, cannot be disabled)
  - VFG (can be enabled/disabled)
- **Layout Control**:
  - Single engine mode: FreeForm fills entire preview area width
  - Dual engine mode: Side-by-side comparison display
- **Share Functionality**:
  - Share button: Generate sharing link for current Schema
  - Support URL encoding of current editor content

#### UI Design
- Left control area: Schema file selection dropdown
- Middle control area: FreeForm and VFG engine switches
- Right control area: Share button and reset button
- Overall layout uses Flexbox for responsive design

### 4. Preview Area Restructuring (PreviewArea.vue)

#### Dual Engine Layout Logic
- Dynamically switch layout mode based on VFG engine enabled status
- Single mode: FreeForm exclusively occupies entire preview area
- Dual mode: Use CSS Grid for side-by-side layout
- Add divider between preview panels for visual separation

#### Preview Container Style
- Use CSS Grid layout for flexible single/dual column switching
- Single mode: Single column layout, preview panel fills full width
- Dual mode: Three-column layout (left preview + divider + right preview)
- Preview panels use card-style design, including header title and content area

### 4. Form Rendering Components

#### FreeFormPreview.vue
- Refactored based on existing FormPlayground.vue
- Maintain existing error handling mechanism
- Optimize styles to fit new layout

#### VFGPreview.vue (New)
- Integrate Vue Form Generator library for form rendering
- Implement Schema format conversion logic, convert FreeForm schema to VFG format
- Maintain consistent error handling mechanism with FreeForm

### 5. State Management Design

#### Global Single Store Architecture
- **Implementation**: Use `reactive()` to create responsive state object, shared through `provide/inject` or direct export
- **File Location**: `src/composables/useGlobalStore.ts`
- **State Updates**: All state changes are made through the Store's internal methods, ensuring responsive updates
- **Component Access**: Components access the Store instance via `const store = useGlobalStore()`

#### Store Implementation Pattern
```typescript
// useGlobalStore.ts implementation reference
export function useGlobalStore() {
  const state = reactive({
    code: '',
    selectedSchema: '',
    enableVFG: false,
    editorWidthPercent: 50,
    // ... other states
  })

  const actions = {
    updateCode: (newCode: string) => { state.code = newCode },
    updateSelectedSchema: (schema: string) => { state.selectedSchema = schema },
    // ... other action methods
  }

  return { ...toRefs(state), ...actions }
}
```

#### Store Structure Design

**Single Global Store (useGlobalStore)**
- Contains all states and action methods of the application
- Implements responsive state management using Vue 3 Composition API
- Provides unified state update and access interface

**Complete State Definition**
- **Code Content** (code): Current Schema code in the editor
- **Selected File** (selectedSchema): Currently selected Schema file path
- **VFG Engine Status** (enableVFG): Whether VFG engine is enabled
- **Editor Width** (editorWidthPercent): Percentage of editor width to overall width
- **Schema File List** (schemaOptions): All available Schema file options
- **Share Link** (shareUrl): Currently generated share link
- **Loading Status** (isLoading): Whether the application is in loading state
- **Error Status** (error): Current error message
- **Dragging Status** (isDragging): Whether the divider is being dragged

#### Component and Store Interaction Specifications
- **Read-only State Access**: `const { code, selectedSchema } = useGlobalStore()` destructure to get responsive state
- **State Update**: `const { updateCode, updateSelectedSchema } = useGlobalStore()` get operation functions
- **Direct Modification Prohibited**: Components cannot directly modify Store state, must use provided operation functions
- **Responsive Guarantee**: All state changes automatically trigger dependent components to re-render
- **Asynchronous Handling**: File loading and other asynchronous operations are encapsulated in Store actions for unified handling

#### State Synchronization Strategy
- **Single Data Source**: All state changes go through the global store, ensuring data consistency
- **Functional Operations**: Use operation functions provided by the store as entry points for state changes, achieving component decoupling
- **Asynchronous Operations**: File loading, Schema parsing, and other async operations handled uniformly in the store
- **Error Handling**: Global error state management, unified error display and handling logic
- **URL State Sync**: Core states sync to URL hash in real-time, supporting sharing and bookmark functionality
- **Compression Optimization**: Use fflate to compress URL hash data, reducing link length

### 6. URL State Synchronization Design

#### URL Hash Sync Strategy
- **Real-time Sync**: Automatically update URL hash when core states change, ensuring URL always reflects current application state
- **Debounce Mechanism**: Apply debouncing to frequent state changes, avoiding excessive URL updates
- **Selective Sync**: Only synchronize core states meaningful for sharing, avoiding overly complex URLs

#### Sync State Range
- **Code Content** (code): Current Schema code in editor - core sharing content
- **VFG Engine Status** (enableVFG): Engine enabled status - affects preview effect
- **Editor Width** (editorWidthPercent): Layout ratio - user preference setting
- **Non-sync States**: Loading status, error status, dragging status and other temporary states

#### fflate Compression Implementation Details
- **Compression Process**: `State object → JSON.stringify() → strToU8() → gzip() → strFromU8(base64encode())`
- **Decompression Process**: `base64decode() → gzip decompress → u8ToStr() → JSON.parse() → State object`
- **Error Handling**: Wrap the entire decompression process in try-catch, return default state on failure
- **Data Validation**: Validate state object structure after decompression, supplement missing fields with default values

#### URL Structure and Limitations
- **URL Format**: `https://example.com/#<base64_compressed_data>`
- **Length Control**: Target compressed URL total length < 2000 characters (compatible with mainstream browsers)
- **Overlength Handling**: If still too long after compression, remove non-core states (like error messages, loading status, etc.)
- **Compatibility**: Base64 encoding ensures URL character safety, avoiding special character issues

#### Implementation Code Structure
```typescript
// src/utils/compression.ts
export function compressState(state: AppState): string {
  const stateString = JSON.stringify(state)
  const compressed = gzip(strToU8(stateString))
  return strFromU8(compressed, true) // true for base64
}

export function decompressState(hash: string): AppState | null {
  try {
    const compressed = strToU8(hash, true) // true for base64
    const decompressed = ungzip(compressed)
    return JSON.parse(strFromU8(decompressed))
  } catch (error) {
    console.warn('Failed to decompress state:', error)
    return null
  }
}
```

#### URL Structure Design
```
https://example.com/#<compressed_state>
```
- Use concise hash structure, with compressed state directly as hash value
- Compatibility consideration: Ensure compressed hash complies with URL specification
- Length limitation: Monitor total URL length after compression to avoid exceeding browser limits

#### Initialization Loading Logic
- **URL Priority**: Prioritize parsing state from URL hash when page loads
- **Default State**: Use preset default state when URL has no state
- **Error Recovery**: Automatically clean invalid hash and use default state when parsing fails

#### Share Functionality Enhancement
- **One-click Share**: Current URL is the sharing link, no need to generate separately
- **Link Preview**: Provide preview functionality for sharing link
- **Version Compatibility**: Consider backward compatibility for future state structure changes

### 7. Interaction Design and User Flow

#### File Selection Flow
1. **File List Loading**: Scan `examples/` directory to generate file options during page initialization
2. **Selector Interaction**: User clicks dropdown selector → Display file list → Select file
3. **File Loading**: `loadSchemaFile(filePath)` → `fetch(filePath)` → `updateCode(content)`
4. **Editor Update**: Monaco Editor automatically displays new content, triggering preview update
5. **URL Sync**: Update URL hash to include new file path after selection

#### Engine Switching Flow
1. **VFG Switch Toggle**: User clicks VFG switch → `toggleVFGEngine()` → `enableVFG = !enableVFG`
2. **Layout Auto-adjustment**:
   - Single engine mode: `grid-template-columns: 1fr`
   - Dual engine mode: `grid-template-columns: 1fr 1px 1fr`
3. **Preview Area Re-render**: Vue reactive system automatically re-renders PreviewArea component
4. **State Persistence**: Engine state is synchronized to URL hash for persistence

#### Share Functionality Flow
1. **URL Generation**: Current page URL is the sharing link (including compressed state)
2. **Copy to Clipboard**: `navigator.clipboard.writeText(location.href)`
3. **User Feedback**: Display "Link copied" notification, automatically disappearing after 3 seconds
4. **Link Preview**: Optional display of sharing link thumbnail preview and QR code

#### Code Editing Flow
1. **Real-time Parsing**: Monaco Editor onChange → `debounce(updateCode, 300ms)`
2. **Syntax Validation**: Use Monaco built-in JSON syntax check, show red wavy line on error
3. **Preview Update**: Code change → Schema parsing → Preview component re-render
4. **Error Handling**: Display error message in preview area when JSON parsing fails, without affecting editor functionality

### 8. Error Handling and Edge Cases

#### Schema Parsing Error Handling
- **JSON Syntax Error**:
  - Monaco Editor displays red wavy line and error hint
  - Preview area shows "JSON format error, please check syntax" message
  - Error message format: `SyntaxError: line ${line}, column ${column}: ${message}`
- **Schema Structure Error**:
  - Preview area shows specific field error messages
  - Supports partial rendering: Error fields show warning, correct fields render normally

#### Rendering Engine Error Handling
- **FreeForm Rendering Failure**:
  - Use Vue 3 ErrorBoundary to catch component errors
  - Display error message and "Reload" button
  - Report errors to console.error() for debugging
- **VFG Engine Initialization Failure**:
  - Automatically disable VFG option, display "VFG engine unavailable" status
  - Provide fallback: Only use FreeForm for rendering
- **Network Error Handling**:
  - Display retry button and error details when file loading fails
  - Show "Loading failed" status after 3 retry attempts

#### URL and Compression Error Handling
- **Compressed Data Corruption**:
  - Catch decompression exceptions, automatically clean location.hash
  - Initialize application with default state
  - Output warning messages in developer console
- **Data Exceeding Limit**:
  - Monitor URL length after compression, show warning when exceeding 2000 characters
  - Provide "Simplified sharing" option: Only share core states (code + enableVFG)
  - Fallback approach: Use localStorage to store complete state, URL only stores reference ID

#### Browser Compatibility Handling
- **Clipboard API Not Supported**: Fall back to using `document.execCommand('copy')` or manual text selection
- **Monaco Editor Loading Failure**: Display basic textarea as backup editor
- **ES6+ Feature Detection**: Use Babel polyfill to ensure core functionality in older browsers

### 9. Performance Optimization Strategy

#### Debounce and Throttle Configuration
- **Code Editing Debounce**: `debounce(updatePreview, 300)` - 300ms delay, balancing responsiveness and performance
- **URL State Sync Debounce**: `debounce(syncToUrl, 500)` - 500ms delay, avoiding frequent browser history updates
- **Window resize Throttle**: `throttle(handleResize, 100)` - 100ms throttling, optimizing drag performance

#### Memory Management
- **Component Unmount Cleanup**:
  - Clean up Monaco Editor instance: `editor.dispose()`
  - Remove event listeners and timers
  - Clean up resources like ResizeObserver API

## Development Plan

### Phase 1: Basic Infrastructure Setup
- [ ] Create `src/composables/useGlobalStore.ts` - Implement global state management
- [ ] Create `src/utils/compression.ts` - Implement fflate compression/decompression utility functions
- [ ] Create `src/composables/useUrlSync.ts` - Implement URL state synchronization logic
- [ ] Refactor `src/App.vue` - Implement left-right two-column layout, integrate ResizablePanes component
- [ ] Create `src/components/PlaygroundHeader.vue` - Implement header control area

### Phase 2: Core Component Development
- [ ] Create `src/components/ResizablePanes.vue` - Implement draggable adjustable panel container
- [ ] Create `src/components/PreviewArea.vue` - Implement preview area container and single/dual column layout switching
- [ ] Refactor `src/FormPlayground.vue` → `src/components/FreeFormPreview.vue`
- [ ] Create `src/components/VFGPreview.vue` - VFG preview component (reserved interface)
- [ ] Create subcomponents: SchemaSelector, EngineControls, ShareButton

### Phase 3: Feature Integration and Optimization
- [ ] Integrate all components to global Store, implement unified state management
- [ ] Implement URL state synchronization and sharing functionality, add error handling
- [ ] Improve responsive layout and mobile adaptation
- [ ] Add error boundaries and exception handling mechanism
- [ ] Performance optimization: debounce, lazy loading, code splitting

### Phase 4: Testing and Refinement
- [ ] Error scenario testing: file loading failure, JSON parsing error, engine initialization failure
- [ ] Browser compatibility testing and fallback implementation
- [ ] URL sharing functionality testing, including long link handling and compression effect verification
- [ ] Performance testing: large file loading, frequent operation responsiveness, memory leak checking

## File Change List

### New Files (sorted by creation priority)
```
src/composables/useGlobalStore.ts        # Global state management, highest priority
src/utils/compression.ts                 # fflate compression tool, core dependency
src/composables/useUrlSync.ts            # URL state synchronization, depends on above two files
src/components/PlaygroundHeader.vue      # Header control area
src/components/ResizablePanes.vue        # Draggable panel container
src/components/PreviewArea.vue           # Preview area container
src/components/FreeFormPreview.vue       # FreeForm preview component (refactored from FormPlayground.vue)
src/components/VFGPreview.vue            # VFG preview component
src/components/SchemaSelector.vue        # Schema file selector
src/components/EngineControls.vue        # Engine control switches
src/components/ShareButton.vue           # Share button
```

### Modified Files (sorted by modification importance)
```
src/App.vue                             # Main layout refactoring, integrate new component architecture
package.json                            # Add dependencies: fflate, vue-router (optional)
src/main.ts                             # May need to add global error handling
src/style.css                           # Add global styles, especially drag and layout related
```

### Deleted Files
```
src/FileTree.vue                        # File tree component no longer needed
```

### Dependencies to Add
```bash
# Core dependencies
pnpm add fflate                         # Compression library
pnpm add lodash-es                      # Utility functions (debounce, throttle)
pnpm add @types/lodash-es -D            # TypeScript type definitions

# Optional dependencies (add as needed)
pnpm add vue-virtual-scroller           # Virtual scrolling (for large data volumes)
pnpm add @vueuse/core                   # Common composition functions (optional, provides useClipboard etc.)
```

## AI Implementation Guide Summary

This design document provides detailed technical specifications and implementation guidance for AI:

### Core Implementation Points
1. **State Management**: Use Vue 3 Composition API's `reactive()` to implement global state, avoiding additional dependencies
2. **Component Communication**: Strictly follow one-way data flow, all state changes go through Store operation functions
3. **Drag Implementation**: Based on native DOM events, using CSS custom properties to control layout ratio
4. **Compression Algorithm**: Use fflate's gzip compression, detailed compression/decompression process has been explained
5. **Error Handling**: Multi-level error handling mechanism, including specific error recovery strategies

### Key Technical Details
- **Debounce Configuration**: Code editing 300ms, URL sync 500ms, window resize 100ms
- **Performance Thresholds**: Schema 100KB warning, 1MB error, 50+ form fields enable virtual scrolling
- **Layout Breakpoints**: 1440px/1200px/768px three key breakpoints, corresponding to different layout strategies
- **Drag Range**: 30%-70% width limit, corresponding to minimum width 360px-840px

### Implementation Priority
1. **Basic Infrastructure**: Store → Compression Tool → URL Sync → Main Layout
2. **Core Components**: Draggable Panel → Preview Area → Header Control
3. **Feature Integration**: State Management Integration → Error Handling → Performance Optimization
4. **Testing Refinement**: Error Scenarios → Compatibility → Performance Verification

### Code Organization Principles
- Tool functions isolated to `utils/` directory
- Composition functions placed in `composables/` directory
- Components grouped by functionality, avoiding single giant components
- Type definitions centrally managed, ensuring type safety

This document provides a complete implementation path, AI can implement precisely according to the specified tech stack and architecture pattern.

**Note: All text and code comments in this application must be written in English.**
