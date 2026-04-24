import { IDSDialog } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const headlineNode = headline ? (
    <Heading level={2} size="xl" tabIndex={-1}>
      {headline}
    </Heading>
  ) : undefined

  return (
    <DialogPortal>
      <IDSDialog headline={headlineNode} data-open={open ? 'true' : 'false'} show={open} onVisibilityChange={setOpen} {...props}>
        {open && <div className="ids-content">{children}</div>}
      </IDSDialog>
    </DialogPortal>
  )
}
