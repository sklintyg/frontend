import { useState } from 'react'
import { filterUnsupportedCharacters } from '../../../../utils/textUtils'

interface UseIso8859SanitizationResult {
  sanitize: (input: string) => string
  resetWarning: () => void
  showWarning: boolean
}

/**
 * Hook that sanitizes text input to only contain ISO-8859-1 compatible characters.
 * Call sanitize() on blur to clean the value and show the warning if chars were removed.
 * Call resetWarning() in onChange to hide the warning as soon as the user starts editing.
 */
const useIso8859Sanitization = (): UseIso8859SanitizationResult => {
  const [showWarning, setShowWarning] = useState(false)

  const sanitize = (input: string): string => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters(input)
    if (hasRemovedCharacters) {
      setShowWarning(true)
    }
    return sanitized
  }

  const resetWarning = () => setShowWarning(false)

  return { sanitize, resetWarning, showWarning }
}

export default useIso8859Sanitization

