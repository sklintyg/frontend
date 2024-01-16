export function GetFilteredSuggestions(typeAheadlist: string[], text: string): string[] {
  const sortResult = [
    ...typeAheadlist.filter((suggestion: string) => suggestion.toLowerCase().startsWith(text.toLowerCase())).sort(),
    ...typeAheadlist.filter((suggestion: string) => suggestion.toLowerCase().indexOf(text.toLowerCase()) >= 0).sort(),
  ]

  const newResult = new Set(sortResult)
  return Array.from(newResult)
}
