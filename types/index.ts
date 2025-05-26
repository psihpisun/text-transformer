export type MaskType = "lite" | "medium" | "hard"

export interface MaskOption {
  id: MaskType
  name: string
  preview: string
  mask: Record<string, string>
  letterCount: number
}

export interface TransformState {
  inputText: string
  outputText: string
  selectedMask: MaskType
  copied: boolean
}