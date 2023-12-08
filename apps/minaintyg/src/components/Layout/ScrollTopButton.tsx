import { classNames } from '@frontend/components'
import { IDSButton, IDSIconArrow } from '@frontend/ids-react-ts'
import { getTabbableNodes } from 'focus-lock'
import { useEffect, useState } from 'react'

export function ScrollTopButton() {
  const [show, setShow] = useState(false)
  const [isScrolling, updateIsScrolling] = useState(false)

  useEffect(() => {
    let previousScrollPos = 0
    const handleScroll = () => {
      const scrollPos = document.body.getBoundingClientRect().top
      const isScrollInterupted = previousScrollPos > 0 && scrollPos > previousScrollPos

      setShow(scrollPos < -180)
      if (isScrolling && (scrollPos === 0 || isScrollInterupted)) {
        updateIsScrolling(false)
        const mainElement = document.querySelector('main')
        if (!isScrollInterupted && mainElement instanceof HTMLElement) {
          getTabbableNodes([mainElement], new Map())[0].node.focus()
        }
        previousScrollPos = 0
      }
      previousScrollPos = scrollPos
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isScrolling])

  return (
    <div
      className={classNames(
        'sticky bottom-0 h-16 opacity-0 transition-opacity ease-in-out pointer-events-none',
        show && 'opacity-100 pointer-events-auto'
      )}
    >
      <IDSButton
        fab
        role="button"
        className="ids-hide ids-show-1177 absolute bottom-5 right-5 select-none"
        aria-label="Till toppen av sidan"
        onClick={() => {
          updateIsScrolling(true)
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        }}
      >
        <IDSIconArrow color="var(--color-main)" width="24" height="24" rotate="-90" />
      </IDSButton>
    </div>
  )
}
