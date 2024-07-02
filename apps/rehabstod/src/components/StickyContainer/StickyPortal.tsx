import type { ReactNode } from 'react'
import { useContext } from 'react'
import { createPortal } from 'react-dom'
import { StickyContext } from './StickyContainerProvider'

export function StickyPortal({ children, key }: { children: ReactNode; key?: string }) {
  const stickyContainer = useContext(StickyContext)
  return createPortal(children, stickyContainer ?? document.body, key)
}
