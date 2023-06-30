import handyScroll from 'handy-scroll'
import { ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import './FloatingScroll.css'

export function FloatingScroll({ children, id }: { children: ReactNode; id: string }) {
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
      }
    },
  ])

  return (
    <div id={id} style={{ overflow: 'auto' }} ref={mergedRefCallback}>
      {children}
    </div>
  )
}
