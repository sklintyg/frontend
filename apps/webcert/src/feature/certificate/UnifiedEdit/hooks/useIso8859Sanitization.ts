import { useState } from 'react'
import { filterUnsupportedCharacters } from '../../../../utils/textUtils'

interface UseIso8859SanitizationResult {
  sanitize: (input: string) => string
  showWarning: boolean
  sanitizedInitialValue: string
}

/**
 * Hook that sanitizes text input to only contain ISO-8859-1 compatible characters.
 * Call sanitize() in onChange to clean the value and show the warning if chars were removed.
 * Passing an empty string resets the warning.
 *
 * Pass initialValue to also sanitize a value pre-filled from the backend (e.g. via SOAP).
 * The hook will initialize showWarning=true and return sanitizedInitialValue if the initial
 * value contained unsupported characters.
 */
const useIso8859Sanitization = (initialValue?: string): UseIso8859SanitizationResult => {
  const [{ sanitizedInitialValue, hadInitialInvalidChars }] = useState(() => {
    if (!initialValue) return { sanitizedInitialValue: initialValue ?? '', hadInitialInvalidChars: false }
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters(initialValue)
    return { sanitizedInitialValue: sanitized, hadInitialInvalidChars: hasRemovedCharacters }
  })

  const [showWarning, setShowWarning] = useState(hadInitialInvalidChars)

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

  return { sanitize, showWarning, sanitizedInitialValue }
}

export default useIso8859Sanitization
