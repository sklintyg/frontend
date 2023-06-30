import { ReactNode, useEffect, useRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'

export function FixedTableHeader({
  children,
  bottomMargin,
  topMargin,
}: {
  children: ReactNode
  bottomMargin: number
  topMargin?: boolean
}) {
  const ref = useRef<HTMLTableSectionElement>(null)
  const fixedHeader = useRef<HTMLTableSectionElement>(null)
  const [fixed, setFixed] = useState(false)
  const outerDiv = useRef<HTMLDivElement>(null)
  const innerDiv = useRef<HTMLDivElement>(null)
  const { tableWidth, scrollDiv } = useTableContext()

  useEffect(() => {
    const handleScroll = () => {
      const parentRect = ref.current?.parentElement?.getBoundingClientRect()
      if (parentRect && ref.current) {
        const { top, bottom, width } = parentRect
        const convertedTop = topMargin ? top - 55 : top
        setFixed(convertedTop < 0 && bottom > bottomMargin)
        if (outerDiv.current && fixedHeader.current && innerDiv.current) {
          fixedHeader.current.style.width = `${tableWidth}px`
          outerDiv.current.style.width = `${width}px`
          innerDiv.current.style.width = `${width + (scrollDiv?.scrollLeft ?? 0)}px`
        }
      }
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [topMargin, bottomMargin, tableWidth, scrollDiv])
  return (
    <>
      {fixed && (
        <thead ref={fixedHeader} className={classNames('fixed z-20 overflow-hidden', topMargin ? 'top-[55px]' : 'top-0')}>
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
