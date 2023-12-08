import { classNames } from '@frontend/components'
import { IDSButton, IDSIconArrow } from '@frontend/ids-react-ts'
import { useEffect, useState } from 'react'

export function ScrollTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(document.body.getBoundingClientRect().top < -180)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

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
        onClick={() =>
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        }
      >
        <IDSIconArrow color="var(--color-main)" width="24" height="24" rotate="-90" />
      </IDSButton>
    </div>
  )
}
