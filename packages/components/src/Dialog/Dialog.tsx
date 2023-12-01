import { IDSDialog, IDSDialogElement } from '@frontend/ids-react-ts'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
import { FocusOn } from 'react-focus-on'

const tabbables = [
  'button:enabled',
  'select:enabled',
  'textarea:enabled',
  'input:enabled',
  'a[href]',
  'area[href]',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[tabindex]',
  '[contenteditable]',
  '[autofocus]',
].join(',')

export function Dialog({
  children,
  button,
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  headline,
  ...props
}: ComponentProps<typeof IDSDialog> & {
  children: ReactNode
  initialOpen?: boolean
  open?: boolean
  button?: ReactNode
  headline?: string
  onOpenChange?: (open: boolean) => void
}) {
  const ref = useRef<IDSDialogElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)
  const returnElRef = useRef<HTMLElement | null>(null)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  useEffect(() => {
    const dialogEl = ref.current
    const isShown = (dialogEl?.show ?? 'false') !== 'false'

    function handleVisibilityChanged() {
      setOpen(dialogEl?.show === 'true')
    }

    if (open === true && !isShown) {
      returnElRef.current = document.activeElement as HTMLElement
      dialogEl?.setAttribute('show', 'true')
      dialogEl?.showDialog()
    }
    if (open === false && isShown) {
      dialogEl?.setAttribute('show', 'false')
      dialogEl?.hideDialog()
    }

    dialogEl?.addEventListener('changedVisibility', handleVisibilityChanged)
    return () => dialogEl?.removeEventListener('changedVisibility', handleVisibilityChanged)
  }, [open, setOpen])

  return (
    <FocusOn
      enabled={open}
      scrollLock={false}
      autoFocus={false}
      onActivation={() => {
        setTimeout(() => {
          const firstEl = ref.current?.querySelector(tabbables)
          if (firstEl && Object.getPrototypeOf(firstEl).focus !== undefined) {
            Object.getPrototypeOf(firstEl).focus.call(firstEl)
          }
        }, 0)
      }}
      onDeactivation={() => {
        // Without the zero-timeout, focus will likely remain on the button/control
        // you used to set isFocusLockDisabled = true
        setTimeout(() => returnElRef?.current?.focus(), 0)
      }}
    >
      <IDSDialog role="dialog" nofocustrap autofocus={false} ref={ref} {...props}>
        {headline && (
          <h3 className="ids-heading-2" slot="headline">
            {headline}
          </h3>
        )}
        {button}
        {open && children}
      </IDSDialog>
    </FocusOn>
  )
}
