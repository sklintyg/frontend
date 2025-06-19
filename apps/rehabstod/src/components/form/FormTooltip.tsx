/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { IDSTooltip } from '@inera/ids-react'
import type { ReactNode } from 'react'

export function FormTooltip({ children }: { children: ReactNode }) {
  return (
    <IDSTooltip slot="tooltip" position="bottom-left">
      <span className="ids-icon-information ids-icon--m ids-icon--color-preset-1" slot="trigger" tabIndex={0} />
      <div className="max-w-md">{children}</div>
    </IDSTooltip>
  )
}
