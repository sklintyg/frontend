import { IDSDialog } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { Heading } from '../Heading/Heading'
import { DialogPortal } from './DialogPortal'

export function Dialog({
  children,
  headline,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialOpen = false,
  ...props
}: {
  actions?: ReactNode
  children: ReactNode
  dismissible?: boolean
  headline?: string
  initialOpen?: boolean
  noOverlay?: boolean
  noScrollAreaFocus?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  persistent?: boolean
}) {
  const id = useId()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  return (
    <DialogPortal>
      <IDSDialog role="dialog" aria-labelledby={id} data-open={open ? 'true' : 'false'} show={open} onVisibilityChange={setOpen} {...props}>
        {headline && (
          <Heading id={id} level={2} size="m" slot="headline" tabIndex={-1}>
            {headline}
          </Heading>
        )}
        {open && children}
      </IDSDialog>
    </DialogPortal>
  )
}
