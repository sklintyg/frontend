import type { Placement } from '@floating-ui/react'
import {
  autoUpdate,
  flip,
  hide,
  offset,
  shift,
  useClick,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useMemo, useState } from 'react'

export interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift({ padding: 5 }),
      hide(),
    ],
  })

  const { context } = data

  const { delay } = useDelayGroup(context)

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    delay,
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })
  const click = useClick(context)

  const interactions = useInteractions([hover, focus, dismiss, role, click])

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
