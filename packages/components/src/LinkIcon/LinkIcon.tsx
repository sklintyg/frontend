import type { IDSIcon } from '@frontend/ids-react-ts'
import '@inera/ids-design/components/link/link.css'
import { createElement } from 'react'

export function LinkIcon({ icon }: { icon: IDSIcon }) {
  return <span className="ids-link__icon">{createElement(icon, { width: '1em', height: '1em', color: 'currentColor' })}</span>
}
