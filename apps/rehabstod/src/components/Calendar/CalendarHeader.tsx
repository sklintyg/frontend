import { IDSIcon } from '@frontend/ids-react-ts'
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
      <CalendarButton {...prevButtonProps}>
        <IDSIcon name="chevron" rotate="180" width="1em" height="1em" />
      </CalendarButton>
      <span className="grow whitespace-nowrap text-center font-bold">{title}</span>
      <CalendarButton {...nextButtonProps}>
        <IDSIcon name="chevron" width="1em" height="1em" />
      </CalendarButton>
    </div>
  )
}
