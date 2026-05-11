import { act, renderHook } from '@testing-library/react'
import useIso8859Sanitization from './useIso8859Sanitization'

describe('useIso8859Sanitization', () => {
  it('should return showWarning=false initially', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    expect(result.current.showWarning).toBe(false)
  })

  it('should return the original text when no unsupported characters are present', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    let sanitized: string
    act(() => {
      sanitized = result.current.sanitize('Hello, World!')
    })
    expect(sanitized!).toBe('Hello, World!')
    expect(result.current.showWarning).toBe(false)
  })

  it('should set showWarning=true when unsupported characters are removed', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    let sanitized: string
    act(() => {
      sanitized = result.current.sanitize('Hello 😀')
    })
    expect(sanitized!).toBe('Hello ')
    expect(result.current.showWarning).toBe(true)
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
