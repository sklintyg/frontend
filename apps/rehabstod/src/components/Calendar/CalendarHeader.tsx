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
    <div className="mb-2 flex w-full">
      <CalendarButton {...prevButtonProps}>&lt;</CalendarButton>
      <span className="grow whitespace-nowrap text-center">{title}</span>
      <CalendarButton {...nextButtonProps}>&gt;</CalendarButton>
    </div>
  )
}
