import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'

export function Filters({ onSearch, onReset, isDoctor }: { onSearch: () => void; onReset: () => void; isDoctor: boolean }) {
  const [expanded, setExpanded] = useState(true)
  const [filterRequest, setFilterRequest] = useState<ActiveSickLeavesRequest>(defaultFilterRequest)
  const { data: doctors } = useGetDoctorsWithActiveSickLeavesQuery()

  const filterDescriptions = [
    'Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan.',
    'Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i.',
  ]

  const handleReset = () => {
    onReset()
    setFilterRequest(defaultFilterRequest)
  }

  const onFromTimeChange = (value: number) => {
    setFilterRequest({ ...filterRequest, from: value })
  }

  const onToTimeChange = (value: number) => {
    setFilterRequest({ ...filterRequest, to: value })
  }

  const onDoctorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilterRequest({ ...filterRequest, doctor: event.currentTarget.value })
  }

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        <IDSIcon name="chevron" size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <div>
          {isDoctor && (
            <DoctorFilter
              onChange={onDoctorChange}
              doctors={doctors || []}
              selected={filterRequest ? filterRequest.doctor : ''}
              description={filterDescriptions[0]}
            />
          )}
          <TimePeriodFilter
            title="Välj sjukskrivningslängd"
            onFromChange={onFromTimeChange}
            onToChange={onToTimeChange}
            to={filterRequest.to}
            from={filterRequest.from}
            description={filterDescriptions[1]}
          />
          <div className="flex justify-end">
            <IDSButtonGroup className="my-4 flex" style={{ justifyContent: 'flex-end' }}>
              <IDSButton secondary onClick={handleReset}>
                Återställ
              </IDSButton>
              <IDSButton onClick={() => onSearch(filterRequest)}>Sök</IDSButton>
            </IDSButtonGroup>
          </div>
          <hr className="mb-10 opacity-40" />
        </div>
      )}
    </>
  )
}
