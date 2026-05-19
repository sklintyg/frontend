import { act, renderHook } from '@testing-library/react'
import useIso8859Sanitization from './useIso8859Sanitization'

describe('useIso8859Sanitization', () => {
  it('should return showWarning=false initially', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    expect(result.current.showWarning).toBe(false)
  })

  it('should return the sanitized text and set showWarning when unsupported characters are removed', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    let sanitized: string
    act(() => {
      sanitized = result.current.sanitize('Hello 😀')
    })
    expect(sanitized!).toBe('Hello ')
    expect(result.current.showWarning).toBe(true)
  })

  it('should not set showWarning when no unsupported characters are present', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    act(() => {
      result.current.sanitize('Hello, World!')
    })
    expect(result.current.showWarning).toBe(false)
  })

  it('should reset showWarning to false when the input is emptied', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    act(() => {
      result.current.sanitize('Hello 😀')
    })
    expect(result.current.showWarning).toBe(true)

    act(() => {
      result.current.sanitize('')
    })
    expect(result.current.showWarning).toBe(false)
  })

  it('should keep showWarning=true when text still contains valid characters after sanitization', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    act(() => {
      result.current.sanitize('text 😀')
    })
    expect(result.current.showWarning).toBe(true)

    act(() => {
      result.current.sanitize('text ')
    })
    expect(result.current.showWarning).toBe(true)
  })

  it('should preserve Swedish characters without triggering warning', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    let sanitized: string
    act(() => {
      sanitized = result.current.sanitize('åäöÅÄÖ')
    })
    expect(sanitized!).toBe('åäöÅÄÖ')
    expect(result.current.showWarning).toBe(false)
  })
})

describe('useIso8859Sanitization with initialValue', () => {
  it('should return showWarning=true and sanitized value when initialValue contains unsupported characters', () => {
    const { result } = renderHook(() => useIso8859Sanitization('Prefilled 😀'))
    expect(result.current.showWarning).toBe(true)
    expect(result.current.sanitizedInitialValue).toBe('Prefilled ')
  })

  it('should return showWarning=false and unchanged value when initialValue is clean', () => {
    const { result } = renderHook(() => useIso8859Sanitization('Clean text åäö'))
    expect(result.current.showWarning).toBe(false)
    expect(result.current.sanitizedInitialValue).toBe('Clean text åäö')
  })

  it('should return showWarning=false when initialValue is empty', () => {
    const { result } = renderHook(() => useIso8859Sanitization(''))
    expect(result.current.showWarning).toBe(false)
    expect(result.current.sanitizedInitialValue).toBe('')
  })

  it('should return showWarning=false when no initialValue is provided (backwards compatible)', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    expect(result.current.showWarning).toBe(false)
    expect(result.current.sanitizedInitialValue).toBe('')
  })

  it('should still allow sanitize() calls after initialValue was used', () => {
    const { result } = renderHook(() => useIso8859Sanitization('Clean'))
    expect(result.current.showWarning).toBe(false)
    act(() => {
      result.current.sanitize('New 😀')
    })
    expect(result.current.showWarning).toBe(true)
  })
})
