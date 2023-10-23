/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from 'react'

function updateDocumentTitle(el: HTMLElement | null) {
  if (el && el.innerText && el.innerText.length > 0) {
    document.title = `${el.innerText} - 1177`
  }
}

export function useDocumentTitle(ref: RefObject<HTMLElement>, dependencies: unknown[]) {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateDocumentTitle(ref.current)
    })

    if (ref.current) {
      observer.observe(ref.current, { childList: true })
      updateDocumentTitle(ref.current)
    }
    return () => {
      observer.disconnect()
    }
  }, dependencies)
}
