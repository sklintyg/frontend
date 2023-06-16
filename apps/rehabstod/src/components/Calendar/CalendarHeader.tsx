import { IDSIconChevron } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

function CalendarButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)
  const { children } = props

  return (
    <button type="button" {...buttonProps} ref={ref} className="px-3">
      {children}
    </button>
  )
}

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
