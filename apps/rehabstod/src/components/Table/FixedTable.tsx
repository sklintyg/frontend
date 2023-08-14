import { classNames } from '@frontend/components'
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { StickyPortal } from '../StickyContainer/StickyPortal'

export function FixedTable({ children, scrollRef }: { children: ReactNode; scrollRef: RefObject<HTMLDivElement> }) {
  const [scrollLeft, setScrollLeft] = useState(0)
  const [tableWidth, setTableWidth] = useState(0)
  const [fixed, setFixed] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollElementRect = scrollRef.current?.getBoundingClientRect()
      const stickyRect = stickyRef.current?.getBoundingClientRect()
      const marginTop = stickyRect?.top ?? 0
      const marginBottom = 82
      if (scrollElementRect) {
        setFixed(scrollElementRect.top < marginTop && scrollElementRect.bottom - marginBottom - marginTop > 0)
        setTableWidth(scrollElementRect.width)
      }
      setScrollLeft(scrollRef.current?.scrollLeft ?? 0)
    }

    window.addEventListener('resize', handleScroll)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [scrollRef])

  return (
    <StickyPortal>
      <div
        ref={stickyRef}
        style={{ width: `${tableWidth}px` }}
        className={classNames(
          'm-auto max-w-7xl border-neutral-40 bg-secondary-90 order-2 overflow-hidden relative shadow-md',
          fixed ? 'h-auto border-x border-b' : 'h-0'
        )}
      >
        <div style={{ width: `${tableWidth + scrollLeft}px` }} className="float-right">
          <table className="ids-table ids-table-sticky whitespace-nowrap border-none text-sm " style={{ width: `${tableWidth}px` }}>
            {fixed && children}
          </table>
        </div>
      </div>
    </StickyPortal>
  )
}
