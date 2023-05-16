import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment, useDateFieldState } from 'react-stately'

function DateFieldSegment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div {...segmentProps} ref={ref}>
      {segment.text}
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
  const { labelProps, fieldProps } = useDateField(props, state, ref)

  return (
    <div className="flex-1">
      <span {...labelProps}>{label}</span>
      <div {...fieldProps} ref={ref} className="flex gap-1 whitespace-nowrap py-3 px-5">
        {state.segments.map((segment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DateFieldSegment key={index} segment={segment} state={state} />
        ))}
        {state.validationState === 'invalid' && <span aria-hidden="true">🚫</span>}
      </div>
    </div>
  )
}
