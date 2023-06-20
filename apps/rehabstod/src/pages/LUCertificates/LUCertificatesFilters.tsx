import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { TableFilter } from '../../components/Table/TableFilter'
import { RangeFilter } from '../../components/Table/filter/RangeFilter'
import { useAppSelector } from '../../store/hooks'
import { TextSearchFilter } from '../../components/Table/filter/TextSearchFilter'
import { SelectFilter } from '../../components/Table/filter/SelectFilter'
import { getMultipleSelectPlaceholder } from '../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { MultipleSelectFilterOption } from '../../components/Table/filter/MultipleSelectFilterOption'
import { resetFilters, updateFilter } from '../../store/slices/luCertificates.slice'
import { useGetDoctorsForLUCertificatesQuery, useGetPopulatedFiltersQuery, useGetUserQuery } from '../../store/api'
import { DoctorFilter } from '../../components/Table/filter/DoctorFilter'
import { DiagnosisFilter } from '../../components/Table/filter/DiagnosisFilter'
import { DiagnosKapitel } from '../../schemas/diagnosisSchema'
import { isUserDoctor } from '../../utils/isUserDoctor'
import { DateRangeFilter } from '../../components/Table/filter/DateRangeFilter'
import { LUCertificatesFilter } from '../../schemas/luCertificatesSchema'

export function LUCertificatesFilters({ onSearch }: { onSearch: (filter: LUCertificatesFilter) => void }) {
  const { filter, unansweredCommunicationFilterTypes, certificateFilterTypes } = useAppSelector((state) => state.luCertificates)

  const { data: doctorsFilterResponse } = useGetDoctorsForLUCertificatesQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { data: user } = useGetUserQuery()

  const [selectedDiagnosisChapters, setSelectedDiagnosisChapters] = useState<DiagnosKapitel[]>([])
  const dispatch = useDispatch()

  const onReset = () => {
    dispatch(resetFilters())
    setSelectedDiagnosisChapters([])
  }

  if (!user) {
    return null
  }

  return (
    <TableFilter onSearch={() => onSearch(filter)} onReset={onReset}>
      <div className="grid grid-cols-3 gap-x-10 gap-y-7">
        <DiagnosisFilter
          onChange={(diagnosisChapters) => {
            dispatch(updateFilter({ diagnoses: diagnosisChapters.map((diagnosisChapter) => diagnosisChapter.id) }))
            setSelectedDiagnosisChapters(diagnosisChapters)
          }}
          allDiagnoses={(populatedFilters && populatedFilters.allDiagnosisChapters) || []}
          enabledDiagnoses={(populatedFilters && populatedFilters.allDiagnosisChapters) || []}
          selected={selectedDiagnosisChapters}
          description="Filtrerar på den diagnos som skrivs ut först för sjukfallet uppdelat på kapitel. Diagnoskapitel som saknar data är inte valbara."
        />
        {!isUserDoctor(user) && (
          <DoctorFilter
            onChange={(doctorIds) => dispatch(updateFilter({ doctors: doctorIds }))}
            doctors={doctorsFilterResponse && doctorsFilterResponse.doctors ? doctorsFilterResponse.doctors : []}
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
      </div>
    </TableFilter>
  )
}
