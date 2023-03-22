import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'

export function CurrentSickLeavesFilters({ onSearch, onReset }: { onSearch: () => void; onReset: () => void }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
        <IDSIcon name="chevron" size="xs" rotate={expanded ? 270 : 90} colorpreset={1} className="inline ml-1" />
      </IDSButton>
      {expanded && (
        <IDSButtonGroup className="flex flex my-4" style={{ justifyContent: 'flex-end' }}>
          <IDSButton secondary onClick={onReset}>
            Återställ
          </IDSButton>
          <IDSButton onClick={onSearch}>Sök</IDSButton>
        </IDSButtonGroup>
      )}
    </>
  )
}
