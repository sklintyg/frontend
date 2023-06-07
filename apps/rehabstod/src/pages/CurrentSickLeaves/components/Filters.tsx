import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { parseDate } from '@internationalized/date'
import { useState } from 'react'
import { DateRange } from 'react-aria'
import { useDispatch } from 'react-redux'
import { DateRangePicker } from '../../../components/Form/Date/DateRangePicker/DateRangePicker'
import { DiagnosKapitel, SickLeaveFilter, SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { updateFilter } from '../../../store/slices/sickLeave.slice'
import { getMultipleSelectPlaceholder } from '../utils/getMultipleSelectPlaceholder'
import { DiagnosisFilter } from './filter/DiagnosisFilter'
import { DoctorFilter } from './filter/DoctorFilter'
import { MultipleSelectFilterOption } from './filter/MultipleSelectFilterOption'
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
  const [sickLeaveRange, setSickLeaveRange] = useState<DateRange | null>(
    filter.fromSickLeaveEndDate && filter.toSickLeaveEndDate
      ? { start: parseDate(filter.fromSickLeaveEndDate), end: parseDate(filter.toSickLeaveEndDate) }
      : null
  )
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
          <div className="grid grid-cols-4 gap-x-10 gap-y-8">
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
            <MultipleSelectFilterOption
              label="REKO-status"
              onChange={(values) => dispatch(updateFilter({ rekoStatusTypeIds: values }))}
              options={populatedFilters ? populatedFilters.rekoStatusTypes : []}
              selected={filter.rekoStatusTypeIds}
              description="Filtrerar på den REKO-status som satts för patienten."
              placeholder={getMultipleSelectPlaceholder(filter.rekoStatusTypeIds, populatedFilters ? populatedFilters.rekoStatusTypes : [])}
            />
            <TimePeriodFilter
              label="Sjukskrivningslängd"
              description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
              onChange={onSickLeaveLengthIntervalsChange}
              availableOptions={sickLeaveLengthIntervals}
              selectedOptions={filter.sickLeaveLengthIntervals}
            />
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
            <MultipleSelectFilterOption
              label="Sysselsättning"
              onChange={(values) => dispatch(updateFilter({ occupationTypeIds: values }))}
              options={populatedFilters ? populatedFilters.occupationTypes : []}
              selected={filter.occupationTypeIds}
              description="Filtrerar på patientens sysselsättning."
              placeholder={getMultipleSelectPlaceholder(filter.occupationTypeIds, populatedFilters ? populatedFilters.occupationTypes : [])}
            />
            <div>
              <DateRangePicker
                value={sickLeaveRange}
                onChange={(value) => {
                  setSickLeaveRange(value)
                  dispatch(
                    updateFilter({
                      fromSickLeaveEndDate: value ? value.start.toString() : null,
                      toSickLeaveEndDate: value ? value.end.toString() : null,
                    })
                  )
                }}
                label="Slutdatum"
                description="Filtrerar på slutdatum för det sjukfall som det aktiva intyget ingår i."
              />
            </div>
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
