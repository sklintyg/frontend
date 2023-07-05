import { IDSDialog, IDSDialogElement } from '@frontend/ids-react-ts'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'

export function Dialog({
  children,
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  ...props
}: ComponentProps<typeof IDSDialog> & {
  children: ReactNode
  initialOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const ref = useRef<IDSDialogElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  useEffect(() => {
    const dialogEl = ref.current
    const isShown = (dialogEl?.show ?? 'false') !== 'false'

    function handleVisibilityChanged() {
      setOpen(dialogEl?.show === 'true')

      if (dialogEl?.show === 'true') {
        dialogEl?.querySelector('input')?.focus()
      }
    }

    if (open === true && !isShown) {
      dialogEl?.showDialog()
    }
    if (open === false && isShown) {
      dialogEl?.hideDialog()
    }

    dialogEl?.addEventListener('changedVisibility', handleVisibilityChanged)
    return () => dialogEl?.removeEventListener('changedVisibility', handleVisibilityChanged)
  }, [open, setOpen])

  return (
    <IDSDialog role="dialog" show={open ? 'true' : 'false'} ref={ref} {...props}>
      {open && children}
    </IDSDialog>
  )
}
