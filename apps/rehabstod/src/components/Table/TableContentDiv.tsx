import { ReactNode } from 'react'
import useResizeObserver from 'use-resize-observer'
import { mergeRefs } from 'react-merge-refs'

export function TableContentDiv({ children, tableContext }: { children: ReactNode; tableContext: any }) {
  const { ref } = useResizeObserver<HTMLDivElement>()

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
