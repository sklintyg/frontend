import { createCalendar } from '@internationalized/date'
import { useEffect, useRef } from 'react'
import type { AriaDateFieldProps, DateValue } from 'react-aria'
import { useDateField, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'
import { DateFieldSegment } from './DateFieldSegment'

interface DateFieldProps extends AriaDateFieldProps<DateValue> {
  onDataChanged?: (val: string | null) => void
  data?: string | null
}

export function DateField({ label, onDataChanged, data, ...props }: DateFieldProps) {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })
  const ref = useRef(null)
  const { labelProps, fieldProps } = useDateField({ label, ...props }, state, ref)
  const segmentData = state.segments
    .map(({ text }) => text.replace(/[^\d]/g, ''))
    .filter(Boolean)
    .join('-')

  if (data === null && segmentData.length > 0) {
    state.clearSegment('year')
    state.clearSegment('month')
    state.clearSegment('day')
  }

  useEffect(() => {
    if (data !== segmentData && onDataChanged) {
      onDataChanged(segmentData)
    }
  }, [data, onDataChanged, segmentData])

  return (
    <div>
      <span {...labelProps}>{label}</span>
      <div {...fieldProps} ref={ref} className="flex py-1.5">
        {state.segments.map((segment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DateFieldSegment key={index} segment={segment} state={state} />
        ))}
      </div>
    </div>
  )
}
