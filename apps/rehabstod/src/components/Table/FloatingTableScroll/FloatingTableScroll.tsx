import handyScroll from 'handy-scroll'
import type { HTMLProps } from 'react'
import { forwardRef } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import './FloatingTableScroll.css'

export const FloatingTableScroll = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children }, outerRef) => {
  const { ref } = useResizeObserver<HTMLDivElement>()
  const mergedRefCallback = mergeRefs([
    ref,
    outerRef,
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
    <div style={{ overflow: 'auto' }} className="relative rounded-lg border border-accent-30" ref={mergedRefCallback}>
      {children}
    </div>
  )
})

FloatingTableScroll.displayName = 'FloatingTableScroll'
