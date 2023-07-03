import handyScroll from 'handy-scroll'
import { ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import './FloatingScroll.css'

export function FloatingTableScroll({ children, tableContext }: { children: ReactNode; tableContext: any }) {
  const { ref } = useResizeObserver<HTMLDivElement>()

  const mergedRefCallback = mergeRefs([
    ref,
    (element: HTMLDivElement) => {
      if (element) {
        if (handyScroll.mounted(element)) {
          handyScroll.update(element)
        } else {
          handyScroll.mount(element)
        }
        tableContext.setScrollDiv(element)
      }
    },
  ])

  return (
    <div style={{ overflow: 'auto' }} ref={mergedRefCallback}>
      {children}
    </div>
  )
}
