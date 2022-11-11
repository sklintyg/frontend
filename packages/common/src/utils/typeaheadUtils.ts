export const GetFilteredSuggestions = function(typeAheadlist: string[], text: string) {
  const sortResult = [
    ...typeAheadlist.filter((suggestion: string) => suggestion.toLowerCase().startsWith(text.toLowerCase())),
    ...typeAheadlist.filter((suggestion: string) => suggestion.toLowerCase().indexOf(text.toLowerCase()) >= 0).sort(),
  ]

  const newResult = new Set(sortResult)
  return Array.from(newResult)
}
