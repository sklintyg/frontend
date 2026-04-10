import type { AriaButtonProps } from 'react-aria'
import { Icon } from '../Icon/Icon'
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
        <Icon icon="chevron-left" />
      </CalendarButton>
      <CalendarButton {...nextButtonProps}>
        <Icon icon="chevron-right" />
      </CalendarButton>
    </div>
  )
}
