import { RefObject, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function updateDocumentTitle(el?: HTMLElement | null) {
  if (el && el.textContent && el.textContent.length > 0) {
    document.title = `${el.textContent} - 1177`
  }
}

function getHeadingElement() {
  return Array.from(document.getElementsByTagName('h1'))[0]
}

export function useDocumentTitle(ref: RefObject<HTMLElement>) {
  const location = useLocation()
  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateDocumentTitle(getHeadingElement())
    })

    if (ref.current) {
      observer.observe(ref.current, { childList: true })
      updateDocumentTitle(getHeadingElement())
    }
    return () => {
      observer.disconnect()
    }
  }, [location, ref])
}
