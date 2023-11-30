import { IDSIcon } from '@frontend/ids-react-ts'
import { createElement } from 'react'

/**
 * Requires ids-design link css '@inera/ids-design/components/link/link.css'
 */
export function LinkIcon({ icon }: { icon: IDSIcon }) {
  return <span className="ids-link__icon">{createElement(icon, { width: '1em', height: '1em', color: 'currentColor' })}</span>
}
