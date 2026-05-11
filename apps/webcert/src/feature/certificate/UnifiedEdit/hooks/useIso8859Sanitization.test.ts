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

  it('should reset showWarning to false when resetWarning is called', () => {
    const { result } = renderHook(() => useIso8859Sanitization())
    act(() => {
      result.current.sanitize('Hello 😀')
    })
    expect(result.current.showWarning).toBe(true)

    act(() => {
      result.current.resetWarning()
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
