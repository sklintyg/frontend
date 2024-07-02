import type { RefObject} from 'react';
import { useEffect } from 'react'

export function useDateFieldFocus(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current

    const eventHandler = (event: KeyboardEvent) => {
      if (event.code === 'Backspace' && element) {
        const fieldElements = element.querySelectorAll("[role='spinbutton']")
        const targetIndex = Array.from(fieldElements).findIndex((el) => el === event.target)
        const targetValue = (event.target as HTMLElement).getAttribute('aria-valuetext')

        if (targetIndex > 0 && document.activeElement === event.target && !targetValue?.match(/\d/g)) {
          ;(fieldElements[targetIndex - 1] as HTMLElement).focus()
        }
      }
    }

    element?.addEventListener('keydown', eventHandler)
    return () => {
      element?.removeEventListener('keydown', eventHandler)
    }
  })
}
