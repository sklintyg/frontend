import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { DiagnosKapitel, SickLeaveFilter, SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { updateFilter } from '../../../store/slices/sickLeave.slice'
import { DiagnosisFilter } from './filter/DiagnosisFilter'
import { DoctorFilter } from './filter/DoctorFilter'
import { RangeFilter } from './filter/RangeFilter'
import { TimePeriodFilter } from './filter/TimePeriodFilter'

export function Filters({
  onSearch,
  onReset,
  isDoctor,
}: {
  onSearch: (request: SickLeaveFilter) => void
  onReset: () => void
  isDoctor: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { filter, sickLeaveLengthIntervals } = useAppSelector((state) => state.sickLeave)
  const dispatch = useDispatch()

  const onSickLeaveLengthIntervalsChange = (intervals: SickLeaveLengthInterval[]) => {
    dispatch(updateFilter({ sickLeaveLengthIntervals: intervals }))
  }

  const onDoctorChange = (doctorIds: string[]) => {
    dispatch(updateFilter({ doctorIds }))
  }

  const onDiagnosesChange = (diagnosisChapters: DiagnosKapitel[]) => {
    dispatch(updateFilter({ diagnosisChapters }))
  }

  return (
    <>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4">
        <IDSIcon name="chevron" size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <div>
          <div className="grid grid-cols-2 gap-2">
            <DiagnosisFilter
              onChange={onDiagnosesChange}
              allDiagnoses={(populatedFilters && populatedFilters.allDiagnosisChapters) || []}
              enabledDiagnoses={(populatedFilters && populatedFilters.enabledDiagnosisChapters) || []}
              selected={filter.diagnosisChapters}
              description="Filtrerar på den diagnos som skrivs ut först för sjukfallet uppdelat på kapitel. Diagnoskapitel som saknar data är inte valbara."
            />
            {!isDoctor && (
              <DoctorFilter
                onChange={onDoctorChange}
                doctors={(populatedFilters && populatedFilters.activeDoctors) || []}
                selected={filter ? filter.doctorIds : []}
                description="Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan."
              />
            )}
            <RangeFilter
              title="Åldersspann"
              description="Filtrerar på patientens nuvarande ålder."
              onFromChange={(value) => dispatch(updateFilter({ fromPatientAge: Number(value) }))}
              onToChange={(value) => dispatch(updateFilter({ toPatientAge: Number(value) }))}
              to={filter.toPatientAge.toString()}
              from={filter.fromPatientAge.toString()}
              max="150"
              min="1"
            />
            <TimePeriodFilter
              label="Sjukskrivningslängd"
              description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
              onChange={onSickLeaveLengthIntervalsChange}
              availableOptions={sickLeaveLengthIntervals}
              selectedOptions={filter.sickLeaveLengthIntervals}
            />
            {/* <DateRangeInput
              title="Slutdatum"
              description="Filtrerar på slutdatum för det sjukfall som det aktiva intyget ingår i. "
              // onFromChange={(value) => dispatch(updateFilter({ fromSickLeaveEndDate: value }))}
              // onToChange={(value) => dispatch(updateFilter({ toSickLeaveEndDate: value }))}
              to={filter.toSickLeaveEndDate}
              from={filter.fromSickLeaveEndDate}
            /> */}
          </div>
          <div className="flex justify-end">
            <IDSButtonGroup className="my-4 flex" style={{ justifyContent: 'flex-end' }}>
              <IDSButton secondary onClick={onReset}>
                Återställ
              </IDSButton>
              <IDSButton onClick={() => onSearch(filter)}>Sök</IDSButton>
            </IDSButtonGroup>
          </div>
          <hr className="mb-10 opacity-40" />
        </div>
      )}
    </>
  )
}
