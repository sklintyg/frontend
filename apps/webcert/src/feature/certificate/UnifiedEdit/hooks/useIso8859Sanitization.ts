import { useState } from 'react'
import { filterUnsupportedCharacters } from '../../../../utils/textUtils'

interface UseIso8859SanitizationResult {
  sanitize: (input: string) => string
  showWarning: boolean
}

/**
 * Hook that sanitizes text input to only contain ISO-8859-1 compatible characters.
 * Tracks whether unsupported characters have been removed and exposes a warning flag.
 * The warning is cleared when the field is emptied.
 */
const useIso8859Sanitization = (): UseIso8859SanitizationResult => {
  const [showWarning, setShowWarning] = useState(false)

  const sanitize = (input: string): string => {
    if (input === '') {
      setShowWarning(false)
      return ''
    }

    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters(input)
    if (hasRemovedCharacters) {
      setShowWarning(true)
    }
    return sanitized
  }

  return { sanitize, showWarning }
}

export default useIso8859Sanitization
