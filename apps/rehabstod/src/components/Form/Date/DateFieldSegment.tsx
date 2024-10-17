import { classNames } from 'components'
import { useRef } from 'react'
import { useDateSegment } from 'react-aria'
import type { DateFieldState, DateSegment } from 'react-stately'

export function DateFieldSegment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth: segment.maxValue != null ? `${String(segment.maxValue).length}ch` : '',
      }}
      className="group box-content whitespace-nowrap rounded-sm text-left tabular-nums"
    >
      {segment.isPlaceholder ? (
        <span
          aria-hidden="true"
          className={classNames(
            'block w-full text-center italic pointer-events-none',
            segment.isPlaceholder ? 'visible' : 'hidden',
            segment.isPlaceholder && 'h-0'
          )}
        >
          {segment.placeholder}
        </span>
      ) : (
        segment.text
      )}
    </div>
  )
}
