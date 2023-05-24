import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function ExpandableLink({ children, title }: { children: ReactNode; title: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button className="text-accent-40 flex items-center gap-2 pb-3 underline" type="button" onClick={() => setExpanded(!expanded)}>
        {title}
        <IDSIcon name="chevron" size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
      </button>
      {expanded && children}
    </div>
  )
}