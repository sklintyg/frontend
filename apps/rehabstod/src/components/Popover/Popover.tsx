import type { Placement} from '@floating-ui/react';
import { autoUpdate, flip, offset, size, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import type { ReactNode} from 'react';
import { createContext, useContext, useMemo, useState } from 'react'

interface PopoverProps {
  open?: boolean
  refSized?: boolean
  onOpenChange?: (open: boolean) => void
  role?: 'tooltip' | 'dialog' | 'alertdialog' | 'menu' | 'listbox' | 'grid' | 'tree'
  placement?: Placement
}

function usePopover({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  refSized = false,
  role = 'dialog',
  placement = 'bottom-start',
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(1),
      flip({ padding: 10 }),
      refSized
        ? size({
            apply({ rects, elements }) {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
              })
            },
            padding: 10,
          })
        : null,
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
