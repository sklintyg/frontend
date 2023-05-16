import { autoUpdate, flip, offset, size, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  role?: 'tooltip' | 'dialog' | 'alertdialog' | 'menu' | 'listbox' | 'grid' | 'tree'
}

function usePopover({ open: controlledOpen, onOpenChange: setControlledOpen, role = 'dialog' }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(1),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
        padding: 10,
      }),
    ],
  })

  const dismiss = useDismiss(data.context)
  const interactions = useInteractions([dismiss, useRole(data.context, { role })])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  )
}

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(null)

export const usePopoverContext = () => {
  const context = useContext(PopoverContext)

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }

  return context
}

export function Popover({ children, ...props }: PopoverProps & { children: ReactNode }) {
  const data = usePopover(props)

  return <PopoverContext.Provider value={data}>{children}</PopoverContext.Provider>
}
