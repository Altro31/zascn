// Main component
export { default as HTMLEditor } from "./html-editor-main"

// Sub-components (in case they need to be used separately)
export { default as EditorHeader } from "./editor-header"
export { default as EditorToolbar } from "./editor-toolbar"
export { default as CodeEditor } from "./code-editor"
export { default as PreviewPanel } from "./preview-panel"
export { default as HelpGuide } from "./help-guide"

// Hook
export { useHTMLEditor } from "./useHTMLEditor"

// Types
export type { PreviewDevice, EditorStats, Template } from "./types"

// Templates
export { modernTemplate, portfolioTemplate, defaultTemplate } from "./templates"
