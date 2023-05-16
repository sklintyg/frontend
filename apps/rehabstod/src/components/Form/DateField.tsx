import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment, useDateFieldState } from 'react-stately'
import { classNames } from '../../utils/classNames'

function DateFieldSegment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div {...segmentProps} ref={ref} className={classNames(`segment ${segment.isPlaceholder ? 'placeholder' : ''}`)}>
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
    <div>
      <span {...labelProps}>{label}</span>
      <div {...fieldProps} ref={ref} className="text-neutral-20 my-3 box-border w-full rounded border py-3 text-left">
        {state.segments.map((segment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DateFieldSegment key={index} segment={segment} state={state} />
        ))}
        {state.validationState === 'invalid' && <span aria-hidden="true">🚫</span>}
      </div>
    </div>
  )
}
