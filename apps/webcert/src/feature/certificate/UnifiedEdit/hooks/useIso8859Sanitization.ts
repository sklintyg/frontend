import { useState } from 'react'
import { filterUnsupportedCharacters } from '../../../../utils/textUtils'

interface UseIso8859SanitizationResult {
  sanitize: (input: string) => string
  showWarning: boolean
}

/**
 * Hook that sanitizes text input to only contain ISO-8859-1 compatible characters.
 * Call sanitize() in onChange to clean the value and show the warning if chars were removed.
 * Passing an empty string resets the warning.
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
