import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function ExpandableLink({ children, title, text }: { children: ReactNode; title: string; text: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        className={`${!text ? 'text-accent-40 underline' : ''} flex items-center gap-2 pb-3`}
        type="button"
        onClick={() => setExpanded(!expanded)}>
        {title}
        <IDSIcon name="chevron" size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
      </button>
      {expanded && children}
    </div>
  )
}
