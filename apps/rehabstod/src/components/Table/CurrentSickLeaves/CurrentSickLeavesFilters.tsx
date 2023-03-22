import { IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { useState } from 'react'

export function CurrentSickLeavesFilters({ onSearch }: { onSearch: () => void }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <IDSButtonGroup className="flex flex my-4" style={{ justifyContent: 'flex-end' }}>
          <IDSButton
            secondary
            onClick={() => {
              return
            }}>
            Återställ
          </IDSButton>
          <IDSButton onClick={onSearch}>Sök</IDSButton>
        </IDSButtonGroup>
      )}
    </>
  )
}
