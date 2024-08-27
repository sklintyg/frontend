import { IDSIconExternal } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'

export function LayoutFooterLink({ href, target, children }: { href: string; target?: string; children: ReactNode }) {
  return (
    <>
      <a className="text-white outline-white hover:underline" href={href} target={target} rel="noreferrer">
        {children}
      </a>{' '}
      {target === '_blank' && <IDSIconExternal className="relative -bottom-0.5" width="14" height="14" color="white" inline />}
    </>
  )
}
