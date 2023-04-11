import { IDSButton, IDSButtonGroup, IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActiveSickLeavesRequest, DiagnosKapitel } from '../../../store/types/sickLeave'
import { DoctorFilter } from '../../../components/Table/Filter/DoctorFilter'
import { TimePeriodFilter } from '../../../components/Table/Filter/TimePeriodFilter'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { RootState } from '../../../store/store'
import { updateFilter } from '../sickLeaveSlice'
import { DiagnosisFilter } from '../../../components/Table/Filter/DiagnosisFilter'

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

  const onFromTimeChange = (value: number) => {
    dispatch(updateFilter({ ...filterRequest, fromSickLeaveLength: value }))
  }

  const onToTimeChange = (value: number) => {
    dispatch(updateFilter({ ...filterRequest, toSickLeaveLength: value }))
  }

  const onDoctorChange = (doctorIds: string[]) => {
    dispatch(updateFilter({ ...filterRequest, doctorIds }))
  }

  const onDiagnosesChange = (diagnoses: DiagnosKapitel[]) => {
    dispatch(updateFilter({ ...filterRequest, diagnoses }))
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
              selected={filterRequest.diagnoses}
              description="Filtrerar på den diagnos som skrivs ut först för sjukfallet uppdelat på kapitel. Diagnoskapitel som saknar data är inte valbara."
            />
            {!isDoctor && (
              <DoctorFilter
                onChange={onDoctorChange}
                doctors={(populatedFilters && populatedFilters.activeDoctors) || []}
                selected={filterRequest ? filterRequest.doctorIds : []}
                description="Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan."
              />
            )}
          </div>
          <TimePeriodFilter
            title="Välj sjukskrivningslängd"
            onFromChange={onFromTimeChange}
            onToChange={onToTimeChange}
            to={filterRequest.toSickLeaveLength}
            from={filterRequest.fromSickLeaveLength}
            description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
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
