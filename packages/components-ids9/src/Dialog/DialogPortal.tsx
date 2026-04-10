import type { ReactNode } from 'react'
import { useContext } from 'react'
import { createPortal } from 'react-dom'
import { DialogPortalContext } from './DialogPortalProvider'

export function DialogPortal({ children, key }: { children: ReactNode; key?: string }) {
  const dialogPortal = useContext(DialogPortalContext)
  return createPortal(children, dialogPortal ?? document.body, key)
}
