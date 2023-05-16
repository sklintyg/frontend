import { IDSIcon } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

export function DatePickerButton(props: AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return (
    <button type="button" {...buttonProps} ref={ref} className="bg-accent-40 hover:bg-accent-30 active:bg-accent-30 py-3 px-5">
      <IDSIcon name="calendar" width="1.25em" height="1.25em" color2="white" color="white" />
    </button>
  )
}
