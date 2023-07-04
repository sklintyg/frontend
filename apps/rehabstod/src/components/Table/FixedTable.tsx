import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { classNames } from '../../utils/classNames'

export function FixedTable({ children, scrollRef }: { children: ReactNode; scrollRef: RefObject<HTMLDivElement> }) {
  const [tableRect, setTableRect] = useState<DOMRect>()
  const [scrollLeft, setScrollLeft] = useState(0)
  const [fixed, setFixed] = useState(false)
  const outerDiv = useRef<HTMLDivElement>(null)
  const tableWidth = tableRect?.width ?? 0

  useEffect(() => {
    const handleScroll = () => {
      const parentRect = outerDiv?.current?.parentElement?.getBoundingClientRect()
      if (parentRect) {
        setFixed(parentRect.top < 0 && parentRect.bottom > 0)
        setTableRect(parentRect)
      }
      setScrollLeft(scrollRef.current?.scrollLeft ?? 0)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  })

  return (
    <div
      ref={outerDiv}
      style={{ width: `${tableWidth}px` }}
      className={classNames('fixed top-0 z-20 overflow-hidden', fixed ? 'block' : 'hidden')}
    >
      <div style={{ width: `${tableWidth + scrollLeft}px` }} className="float-right">
        <table className="ids-table whitespace-nowrap border-none text-sm" style={{ width: `${tableWidth}px` }}>
          {children}
        </table>
      </div>
    </div>
  )
}
