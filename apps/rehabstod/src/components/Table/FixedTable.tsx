import { ReactNode, RefObject, useEffect, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import { classNames } from '../../utils/classNames'

export function FixedTable({ children, scrollRef }: { children: ReactNode; scrollRef: RefObject<HTMLDivElement> }) {
  const [scrollLeft, setScrollLeft] = useState(0)
  const [tableWidth, setTableWidth] = useState(0)
  const [fixed, setFixed] = useState(false)

  const { ref } = useResizeObserver<HTMLDivElement>()
  mergeRefs([
    ref,
    scrollRef,
    (element: HTMLDivElement) => {
      if (element) {
        setTableWidth(element.getBoundingClientRect().width)
      }
    },
  ])

  useEffect(() => {
    const handleScroll = () => {
      const scrollElementRect = scrollRef.current?.getBoundingClientRect()
      if (scrollElementRect) {
        setFixed(scrollElementRect.top < 0 && scrollElementRect.bottom > 0)
        setTableWidth(scrollElementRect.width)
      }
      setScrollLeft(scrollRef.current?.scrollLeft ?? 0)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  })

  return (
    <div style={{ width: `${tableWidth}px` }} className={classNames('fixed top-0 z-20 overflow-hidden', fixed ? 'block' : 'hidden')}>
      <div style={{ width: `${tableWidth + scrollLeft}px` }} className="float-right">
        <table className="ids-table whitespace-nowrap border-none text-sm" style={{ width: `${tableWidth}px` }}>
          {children}
        </table>
      </div>
    </div>
  )
}
