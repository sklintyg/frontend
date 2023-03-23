import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { ChangeEvent, useState } from 'react'
import { Checkbox } from '../../Form/Checkbox'

export function CurrentSickLeavesFilters({
  onSearch,
  onReset,
  onShowPersonalInformation,
}: {
  onSearch: () => void
  onReset: () => void
  onShowPersonalInformation: (isChecked: boolean) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [showPersonalInformation, setShowPersonalInformation] = useState(true)

  const handleHidePersonalInformation = (event: ChangeEvent<HTMLInputElement>) => {
    onShowPersonalInformation(event.currentTarget.checked)
    setShowPersonalInformation(event.currentTarget.checked)
  }

  const handleReset = () => {
    setShowPersonalInformation(true)
    onReset()
  }

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
        <IDSIcon name="chevron" size="xs" rotate={expanded ? 270 : 90} colorpreset={1} className="ml-1 inline" />
      </IDSButton>
      {expanded && (
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <Checkbox
            label="Visa personuppgifter"
            checked={showPersonalInformation}
            description="Visar eller döljer patienternas namn och personnummer i tabellen."
            onChange={(event) => handleHidePersonalInformation(event)}
          />
          <IDSButtonGroup className="flex flex my-4" style={{ justifyContent: 'flex-end' }}>
            <IDSButton secondary onClick={handleReset}>
              Återställ
            </IDSButton>
            <IDSButton onClick={onSearch}>Sök</IDSButton>
          </IDSButtonGroup>
        </div>
      )}
    </>
  )
}
