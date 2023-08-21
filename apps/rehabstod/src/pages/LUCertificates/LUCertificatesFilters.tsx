import { useDispatch } from 'react-redux'
import { TableFilter } from '../../components/Table/TableFilter'
import { DateRangeFilter } from '../../components/Table/filter/DateRangeFilter'
import { DiagnosisFilter } from '../../components/Table/filter/DiagnosisFilter'
import { DoctorFilter } from '../../components/Table/filter/DoctorFilter'
import { MultipleSelectFilterOption } from '../../components/Table/filter/MultipleSelectFilterOption'
import { RangeFilter } from '../../components/Table/filter/RangeFilter'
import { SelectFilter } from '../../components/Table/filter/SelectFilter'
import { TextSearchFilter } from '../../components/Table/filter/TextSearchFilter'
import { getMultipleSelectPlaceholder } from '../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { LUCertificatesFilter } from '../../schemas/luCertificatesSchema'
import { useGetUserQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { useGetLUFiltersQuery } from '../../store/luApi'
import { resetLUFilters, updateFilter } from '../../store/slices/luCertificates.slice'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function LUCertificatesFilters({ onSearch }: { onSearch: (filter: LUCertificatesFilter) => void }) {
  const { filter, unansweredCommunicationFilterTypes, certificateFilterTypes } = useAppSelector((state) => state.luCertificates)

  const { data: populatedFilters } = useGetLUFiltersQuery()
  const { data: user } = useGetUserQuery()
  const dispatch = useDispatch()

  const onReset = () => {
    dispatch(resetLUFilters())
  }

  if (!user) {
    return null
  }

  return (
    <TableFilter onSearch={() => onSearch(filter)} onReset={onReset}>
      <DiagnosisFilter
        onChange={(diagnosisChapters) => {
          dispatch(updateFilter({ diagnoses: diagnosisChapters.map((diagnosisChapter) => diagnosisChapter.id) }))
        }}
        allDiagnoses={(populatedFilters && populatedFilters.allDiagnosisChapters) || []}
        enabledDiagnoses={(populatedFilters && populatedFilters.allDiagnosisChapters) || []}
        selected={
          (populatedFilters &&
            populatedFilters.allDiagnosisChapters.filter((diagnosis) => filter.diagnoses.some((id) => diagnosis.id === id))) ||
          []
        }
        description="Filtrerar på den diagnos som skrivs ut först för sjukfallet uppdelat på kapitel. Diagnoskapitel som saknar data är inte valbara."
      />
      {!isUserDoctor(user) && (
        <DoctorFilter
          onChange={(doctorIds) => dispatch(updateFilter({ doctors: doctorIds }))}
          doctors={populatedFilters && populatedFilters.doctors ? populatedFilters.doctors : []}
          selected={filter ? filter.doctors : []}
          description="Filtrerar på den läkare som har utfärdat läkarutlåtandet."
        />
      )}
      <SelectFilter
        onChange={(id) => dispatch(updateFilter({ questionAndAnswers: Number(id) }))}
        options={unansweredCommunicationFilterTypes || []}
        description="Filtrerar på läkarutlåtanden med eller utan obesvarade kompletteringar eller administrativa frågor och svar."
        label="Ärendestatus"
        value={filter.questionAndAnswers ? filter.questionAndAnswers.toString() : ''}
      />
      <TextSearchFilter
        title="Fritextsökning"
        description="Filtrerar på all synlig text och personnummer i tabellen"
        onTextSearchChange={(text) => dispatch(updateFilter({ searchText: text }))}
        placeholder="Hitta läkarutlåtanden som innehåller..."
        textValue={filter.searchText}
      />
      <MultipleSelectFilterOption
        label="Läkarutlåtande"
        onChange={(values) => dispatch(updateFilter({ certTypes: values }))}
        options={certificateFilterTypes ?? []}
        selected={filter.certTypes}
        description="Filtrerar på typ av läkarutlåtande."
        placeholder={getMultipleSelectPlaceholder(filter.certTypes, certificateFilterTypes || [])}
      />
      <RangeFilter
        title="Åldersspann"
        description="Filtrerar på patientens nuvarande ålder."
        onFromChange={(value) => dispatch(updateFilter({ fromAge: Number(value) }))}
        onToChange={(value) => dispatch(updateFilter({ toAge: Number(value) }))}
        to={filter.toAge.toString()}
        from={filter.fromAge.toString()}
        max="150"
        min="1"
      />
      <DateRangeFilter
        fromDate={filter.fromDate}
        toDate={filter.toDate}
        onChange={(value) => {
          dispatch(
            updateFilter({
              fromDate: value && value.start ? value.start.toString() : null,
              toDate: value && value.end ? value.end.toString() : null,
            })
          )
        }}
        label="Signeringsdatum"
        description="Filtrerar på signeringsdatum. Det är möjligt att välja ett intervall genom att klicka på två olika datum, eller ett enskilt datum genom att klicka på samma datum två gånger."
      />
    </TableFilter>
  )
}
