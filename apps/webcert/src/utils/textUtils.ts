export const replaceDecimalSeparator = (text: string): string => {
  return text.replace(/\./gm, ',')
}

interface FilterUnsupportedCharactersResult {
  sanitized: string
  hasRemovedCharacters: boolean
}

/**
 * Filters out characters not supported by ISO-8859-1 or unsuitable for
 * certificate text fields (e.g. emojis, tabs, hidden Unicode formatting).
 *
 * Allowed code points:
 *   0x0A (\n) – newline, needed in multi-line fields
 *   0x0D (\r) – carriage return
 *   0x20–0x7E – standard printable ASCII
 *   0xA0–0xFF – Latin-1 supplement
 */
export const filterUnsupportedCharacters = (text: string): FilterUnsupportedCharactersResult => {
  let hasRemovedCharacters = false
  const sanitized = Array.from(text)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0
      const isAllowed =
        code === 0x0a || // newline
        code === 0x0d || // carriage return
        code === 0x09 || // horizontal tab
        (code >= 0x20 && code <= 0x7e) || // standard ASCII printable
        (code >= 0xa0 && code <= 0xff) // Latin-1 supplement
      if (!isAllowed) {
        hasRemovedCharacters = true
      }
      return isAllowed
    })
    .join('')
  return { sanitized, hasRemovedCharacters }
}
