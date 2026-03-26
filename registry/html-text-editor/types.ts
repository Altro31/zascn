export type PreviewDevice = "desktop" | "tablet" | "mobile"

export interface EditorStats {
  lineCount: number
  charCount: number
  wordCount: number
}

export interface Template {
  name: string
  content: string
  icon: string
}
