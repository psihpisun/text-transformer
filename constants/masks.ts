import type { MaskOption } from "@/types"
import mask1Data from "@/data/masks/standart.json"
import mask2Data from "@/data/masks/medium.json"
import mask3Data from "@/data/masks/hard.json"

export const lite = mask1Data as Record<string, string>
export const medium = mask2Data as Record<string, string>
export const hard = mask3Data as Record<string, string>

function generatePreview(mask: Record<string, string>): string {
  const testWord = "трансформация"
  return testWord
    .split("")
    .map((char) => mask[char as keyof typeof mask] || char)
    .join("")
}

export const maskOptions: MaskOption[] = [
  {
    id: "lite",
    name: "Lite",
    preview: generatePreview(lite),
    mask: lite,
    letterCount: Object.keys(lite).length,
  },
  {
    id: "medium",
    name: "Medium",
    preview: generatePreview(medium),
    mask: medium,
    letterCount: Object.keys(medium).length,
  },
  {
    id: "hard",
    name: "Hard",
    preview: generatePreview(hard),
    mask: hard,
    letterCount: Object.keys(hard).length,
  },
]

export const MAX_TEXT_LENGTH = 10000
export const COPY_FEEDBACK_DELAY = 2000