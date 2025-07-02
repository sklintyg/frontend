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
  children: ReactNode
  open?: boolean
  headline?: string
  initialOpen?: boolean
  persistent?: boolean
  noOverlay?: boolean
  noScrollAreaFocus?: boolean
  dismissible?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const id = useId()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  return (
    <DialogPortal>
      <IDSDialog role="dialog" aria-labelledby={id} show={open} onVisibilityChange={setOpen} {...props}>
        {open && (
          <>
            {headline && (
              <Heading level={2} size="m" slot="headline" tabIndex={-1}>
                {headline}
              </Heading>
            )}
            {children}
          </>
        )}
      </IDSDialog>
    </DialogPortal>
  )
}
