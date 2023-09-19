import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'
import { DateFieldSegment } from './DateFieldSegment'

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
      </div>
    </div>
  )
}
