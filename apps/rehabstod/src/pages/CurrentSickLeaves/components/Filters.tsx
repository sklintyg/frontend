import { useDispatch } from 'react-redux'
import { SickLeaveFilter, SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { updateFilter } from '../../../store/slices/sickLeave.slice'
import { DiagnosisFilter } from '../../../components/Table/filter/DiagnosisFilter'
import { DoctorFilter } from '../../../components/Table/filter/DoctorFilter'
import { RangeFilter } from '../../../components/Table/filter/RangeFilter'
import { TimePeriodFilter } from '../../../components/Table/filter/TimePeriodFilter'
import { MultipleSelectFilterOption } from '../../../components/Table/filter/MultipleSelectFilterOption'
import { getMultipleSelectPlaceholder } from '../../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { SelectFilter } from '../../../components/Table/filter/SelectFilter'
import { TextSearchFilter } from '../../../components/Table/filter/TextSearchFilter'
import { TableFilter } from '../../../components/Table/TableFilter'
import { DiagnosKapitel } from '../../../schemas/diagnosisSchema'
import { DateRangeFilter } from '../../../components/Table/filter/DateRangeFilter'

export function Filters({
  onSearch,
  onReset,
  isDoctor,
}: {
  onSearch: (request: SickLeaveFilter) => void
  onReset: () => void
  isDoctor: boolean
}) {
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
  const onTextSearchChange = (text: string) => {
    dispatch(updateFilter({ textSearch: text }))
  }

  return (
    <TableFilter onSearch={() => onSearch(filter)} onReset={onReset}>
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
      <TextSearchFilter
        title="Fritextsökning"
        description="Filtrerar på all synlig text och personnummer i tabellen"
        onTextSearchChange={onTextSearchChange}
        placeholder="Hitta sjukfall som innehåller..."
        textValue={filter.textSearch}
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
      <TimePeriodFilter
        label="Sjukskrivningslängd"
        description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
        onChange={onSickLeaveLengthIntervalsChange}
        availableOptions={sickLeaveLengthIntervals}
        selectedOptions={filter.sickLeaveLengthIntervals}
      />
      <MultipleSelectFilterOption
        label="REKO-status"
        onChange={(values) => dispatch(updateFilter({ rekoStatusTypeIds: values }))}
        options={populatedFilters ? populatedFilters.rekoStatusTypes : []}
        selected={filter.rekoStatusTypeIds}
        description="Filtrerar på den REKO-status som satts för patienten."
        placeholder={getMultipleSelectPlaceholder(filter.rekoStatusTypeIds, populatedFilters ? populatedFilters.rekoStatusTypes : [])}
      />
      <SelectFilter
        onChange={(id) => dispatch(updateFilter({ unansweredCommunicationFilterTypeId: id }))}
        options={populatedFilters ? populatedFilters.unansweredCommunicationFilterTypes : []}
        description="Filtrerar på sjukfall med eller utan obesvarade kompletteringar eller administrativa frågor och svar."
        label="Ärendestatus"
        value={filter.unansweredCommunicationFilterTypeId}
      />
      <MultipleSelectFilterOption
        label="Sysselsättning"
        onChange={(values) => dispatch(updateFilter({ occupationTypeIds: values }))}
        options={populatedFilters ? populatedFilters.occupationTypes : []}
        selected={filter.occupationTypeIds}
        description="Filtrerar på patientens sysselsättning."
        placeholder={getMultipleSelectPlaceholder(filter.occupationTypeIds, populatedFilters ? populatedFilters.occupationTypes : [])}
      />
      <DateRangeFilter
        fromDate={filter.fromSickLeaveEndDate}
        toDate={filter.toSickLeaveEndDate}
        onChange={(value) => {
          dispatch(
            updateFilter({
              fromSickLeaveEndDate: value && value.start ? value.start.toString() : null,
              toSickLeaveEndDate: value && value.end ? value.end.toString() : null,
            })
          )
        }}
        label="Slutdatum"
        description="Filtrerar på slutdatum för det sjukfall som det aktiva intyget ingår i."
      />
    </TableFilter>
  )
}
