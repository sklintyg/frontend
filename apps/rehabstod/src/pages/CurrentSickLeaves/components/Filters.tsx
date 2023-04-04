import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActiveSickLeavesRequest } from '../../../store/types/sickLeave'
import { DoctorFilter } from '../../../components/Table/Filter/DoctorFilter'
import { TimePeriodFilter } from '../../../components/Table/Filter/TimePeriodFilter'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { RootState } from '../../../store/store'
import { updateFilter } from '../sickLeaveSlice'

export function Filters({
  onSearch,
  onReset,
  isDoctor,
}: {
  onSearch: (request: ActiveSickLeavesRequest) => void
  onReset: () => void
  isDoctor: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { filterRequest } = useSelector((state: RootState) => state.sickLeave)
  const dispatch = useDispatch()

  const filterDescriptions = [
    'Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan.',
    'Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i.',
  ]

  const onFromTimeChange = (value: number) => {
    dispatch(updateFilter({ ...filterRequest, from: value }))
  }

  const onToTimeChange = (value: number) => {
    dispatch(updateFilter({ ...filterRequest, to: value }))
  }

  const onDoctorChange = (doctorIds: string[]) => {
    dispatch(updateFilter({ ...filterRequest, doctorIds }))
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
              doctors={(populatedFilters && populatedFilters.activeDoctors) || []}
              selected={filterRequest ? filterRequest.doctorIds : []}
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
              <IDSButton secondary onClick={onReset}>
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
