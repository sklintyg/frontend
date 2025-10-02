import { IDSIconChevron } from '@inera/ids-react'
import type { AriaButtonProps } from 'react-aria'
import { CalendarButton } from './CalendarButton'

export function CalendarHeader({
  prevButtonProps,
  nextButtonProps,
  title,
}: {
  title: string
  prevButtonProps: AriaButtonProps<'button'>
  nextButtonProps: AriaButtonProps<'button'>
}) {
  return (
    <div className="mb-4 flex w-full">
      <span className="grow whitespace-nowrap px-2 text-left font-bold">{title}</span>
      <CalendarButton {...prevButtonProps}>
        <IDSIconChevron rotate="180" width=".75em" height=".75em" />
      </CalendarButton>
      <CalendarButton {...nextButtonProps}>
        <IDSIconChevron width=".75em" height=".75em" />
      </CalendarButton>
    </div>
  )
}
