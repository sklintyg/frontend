import { IDSIconQuestion } from 'ids-react-ts'
import type { ReactNode } from 'react'
import { TooltipIcon } from '../Tooltip'

export function InputLabel({ htmlFor, description, children }: { htmlFor: string; description?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
    </label>
  )
}
