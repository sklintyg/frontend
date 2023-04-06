import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { DoctorFilter } from '../../../components/Table/Filter/DoctorFilter'
import { TimePeriodFilter } from '../../../components/Table/Filter/TimePeriodFilter'
import { SickLeaveFilter } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { resetFilters, updateFilter } from '../sickLeaveSlice'

export function Filters({ isDoctor }: { isDoctor: boolean }) {
  const [expanded, setExpanded] = useState(true)
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const [filter, setFilter] = useState<SickLeaveFilter>({
    doctorIds: [],
    fromSickLeaveLength: 1,
    toSickLeaveLength: 365,
  })
  const dispatch = useDispatch()

  const onFromTimeChange = (value: number) => {
    setFilter({ ...filter, fromSickLeaveLength: value })
  }

  const onToTimeChange = (value: number) => {
    setFilter({ ...filter, toSickLeaveLength: value })
  }

  const onDoctorChange = (doctorIds: string[]) => {
    setFilter({ ...filter, doctorIds })
  }

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        <IDSIcon name="chevron" size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <div>
          {!isDoctor && (
            <DoctorFilter
              onChange={onDoctorChange}
              doctors={(populatedFilters && populatedFilters.activeDoctors) || []}
              selected={filter ? filter.doctorIds : []}
              description="Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan."
            />
          )}
          <TimePeriodFilter
            title="Välj sjukskrivningslängd"
            onFromChange={onFromTimeChange}
            onToChange={onToTimeChange}
            to={filter.toSickLeaveLength}
            from={filter.fromSickLeaveLength}
            description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
          />
          <div className="flex justify-end">
            <IDSButtonGroup className="my-4 flex" style={{ justifyContent: 'flex-end' }}>
              <IDSButton secondary onClick={() => dispatch(resetFilters())}>
                Återställ
              </IDSButton>
              <IDSButton onClick={() => dispatch(updateFilter(filter))}>Sök</IDSButton>
            </IDSButtonGroup>
          </div>
          <hr className="mb-10 opacity-40" />
        </div>
      )}
    </>
  )
}
