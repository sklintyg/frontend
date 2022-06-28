export const replaceDecimalSeparator = (text: string): string => {
  return text.replace(/\./gm, ',')
}
