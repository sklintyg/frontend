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

  function updateFixed(parentElement: DOMRect | undefined) {
    if (parentElement) {
      const { top, bottom } = parentElement
      const convertedTop = topMargin ? top - 55 : top
      setFixed(convertedTop < 0 && bottom > bottomMargin)
    }
  }

  function setWidthOnRefObjects(parentRect: DOMRect | undefined) {
    if (parentRect && fixedHeader.current && outerDiv.current && innerDiv.current && scrollDiv) {
      const { width } = parentRect
      fixedHeader.current.style.width = `${tableWidth}px`
      outerDiv.current.style.width = `${width}px`
      innerDiv.current.style.width = `${width + (scrollDiv.scrollLeft ?? 0)}px`
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const parentElement = ref.current?.parentElement?.getBoundingClientRect()
      updateFixed(parentElement)
      setWidthOnRefObjects(parentElement)
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
