export function truncateText(text: string, maxLength: number): string {
  return text.slice(0, maxLength)
}

export function getCharacterCountVariant(count: number, maxLength: number) {
  return count > maxLength * 0.9 ? "destructive" : "secondary"
}

export function formatCharacterCount(count: number, maxLength: number): string {
  return `${count}/${maxLength}`
}