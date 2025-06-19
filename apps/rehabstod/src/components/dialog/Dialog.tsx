import type { IDSDialog as IDSDialogElement } from '@inera/ids-core/components/dialog/dialog-element.js'
import { IDSDialog } from '@inera/ids-react'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { Heading } from '../Heading/Heading'
import { DialogPortal } from './DialogPortal'

export function Dialog({
  children,
  headline,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialOpen = false,
  ...props
}: ComponentProps<typeof IDSDialog> & {
  children: ReactNode
  open?: boolean
  headline?: string
  initialOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const id = useId()
  const ref = useRef<IDSDialogElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  useEffect(() => {
    const dialogEl = ref.current
    const isShown = (dialogEl?.show ?? 'false') !== 'false'

    function handleVisibilityChanged() {
      setOpen(dialogEl?.show === 'true')
    }

    if (open === true && !isShown) {
      dialogEl?.setAttribute('show', 'false')
    }
    if (open === false && isShown) {
      dialogEl?.setAttribute('show', 'true')
    }

    dialogEl?.addEventListener('changedVisibility', handleVisibilityChanged)
    return () => {
      dialogEl?.removeEventListener('changedVisibility', handleVisibilityChanged)
      dialogEl?.showBodyScrollbar()
    }
  }, [open, setOpen])

  return (
    <DialogPortal>
      <IDSDialog role="dialog" aria-labelledby={id} ref={ref} show={open ? 'true' : 'false'} {...props}>
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
