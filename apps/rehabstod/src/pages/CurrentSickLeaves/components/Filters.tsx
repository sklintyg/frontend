import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DiagnosisFilter } from '../../../components/Table/Filter/DiagnosisFilter'
import { DoctorFilter } from '../../../components/Table/Filter/DoctorFilter'
import { TimePeriodFilter } from '../../../components/Table/Filter/TimePeriodFilter'
import { DiagnosKapitel, SickLeaveFilter } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { RootState } from '../../../store/store'
import { updateFilter } from '../sickLeaveSlice'

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
  const { filter } = useSelector((state: RootState) => state.sickLeave)
  const dispatch = useDispatch()

  const onFromTimeChange = (value: string) => {
    dispatch(updateFilter({ fromSickLeaveLength: Number(value) }))
  }

  const onToTimeChange = (value: string) => {
    dispatch(updateFilter({ toSickLeaveLength: Number(value) }))
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
          <div className="flex gap-2">
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
          </div>
          <TimePeriodFilter
            title="Välj sjukskrivningslängd"
            onFromChange={onFromTimeChange}
            onToChange={onToTimeChange}
            to={filter.toSickLeaveLength.toString()}
            from={filter.fromSickLeaveLength.toString()}
            description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
          />
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
