import '@inera/ids-design/components/link/link.css'
import type { IDSIcon } from '@inera/ids-react'
import type { ComponentProps } from 'react'
import { createElement } from 'react'

export function LinkIcon({ icon, ...props }: { icon: IDSIcon } & ComponentProps<IDSIcon>) {
  return <span className="ids-link__icon">{createElement(icon, { width: '1em', height: '1em', color: 'currentColor', ...props })}</span>
}
