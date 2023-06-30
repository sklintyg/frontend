import { ReactNode, useEffect, useRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'

export function FixedTableHeader({ children, bottomMargin }: { children: ReactNode; bottomMargin: number }) {
  const ref = useRef<HTMLTableSectionElement>(null)
  const fixedHeader = useRef<HTMLTableSectionElement>(null)
  const [fixed, setFixed] = useState(false)
  const outerDiv = useRef<HTMLDivElement>(null)
  const innerDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const parentRect = ref.current?.parentElement?.getBoundingClientRect()
      if (parentRect && ref.current) {
        const { top, bottom, width } = parentRect
        setFixed(top < 0 && bottom > bottomMargin)
        if (outerDiv.current && fixedHeader.current && innerDiv.current) {
          const scrollLeft = document.getElementById('scrollDiv')?.scrollLeft
          outerDiv.current.style.width = `${width}px`
          innerDiv.current.style.width = `${width + (scrollLeft ?? 0)}px`
          fixedHeader.current.style.width = `${document.getElementById('contentDiv')?.getBoundingClientRect().width}px`
        }
      }
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [fixed])

  return (
    <>
      {fixed && (
        <thead ref={fixedHeader} className="fixed top-0 z-20 overflow-hidden">
          <div ref={outerDiv} className="mx-auto">
            <div ref={innerDiv} className="float-right">
              {children}
            </div>
          </div>
        </thead>
      )}
      <thead ref={ref} className={classNames(fixed && 'invisible')}>
        {children}
      </thead>
    </>
  )
}
