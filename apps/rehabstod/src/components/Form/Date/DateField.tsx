import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment, useDateFieldState } from 'react-stately'
import { classNames } from '../../../utils/classNames'

function DateFieldSegment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
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
      className="group box-content whitespace-nowrap rounded-sm text-left tabular-nums">
      {segment.isPlaceholder ? (
        <span
          aria-hidden="true"
          className={classNames(
            'text-neutral-40 block w-full text-center italic pointer-events-none',
            segment.isPlaceholder ? 'visible' : 'hidden',
            segment.isPlaceholder && 'h-0'
          )}>
          {segment.placeholder}
        </span>
      ) : (
        segment.text
      )}
    </div>
  )
}

export function DateField({ label, ...props }: AriaDateFieldProps<DateValue>) {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })
  const ref = useRef(null)
  const { labelProps, fieldProps } = useDateField({ label, ...props }, state, ref)

  return (
    <div>
      <span {...labelProps}>{label}</span>
      <div {...fieldProps} ref={ref} className="flex py-3">
        {state.segments.map((segment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DateFieldSegment key={index} segment={segment} state={state} />
        ))}
        {/* {state.validationState === 'invalid' && <span aria-hidden="true">🚫</span>} */}
      </div>
    </div>
  )
}
