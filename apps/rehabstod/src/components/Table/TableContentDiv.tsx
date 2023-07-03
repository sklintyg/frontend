import { ReactNode } from 'react'
import useResizeObserver from 'use-resize-observer'
import { mergeRefs } from 'react-merge-refs'
// eslint-disable-next-line import/no-cycle
import { useTableContext } from './hooks/useTableContext'

export function TableContentDiv({ children }: { children: ReactNode }) {
  const { ref } = useResizeObserver<HTMLDivElement>()
  const tableContext = useTableContext()
  const mergedRefCallback = mergeRefs([
    ref,
    (element: HTMLDivElement) => {
      if (element) {
        tableContext.setTableWidth(element.getBoundingClientRect().width)
      }
    },
  ])
  return (
    <div ref={mergedRefCallback} className="relative pb-4 pt-1">
      {children}
    </div>
  )
}
