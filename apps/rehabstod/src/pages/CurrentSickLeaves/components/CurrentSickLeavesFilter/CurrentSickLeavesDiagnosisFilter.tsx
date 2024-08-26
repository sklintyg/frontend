import { DiagnosisFilter } from '../../../../components/Table/filter/DiagnosisFilter'
import type { DiagnosKapitel } from '../../../../schemas/diagnosisSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../../store/sickLeaveApi'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesDiagnosisFilter() {
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const diagnosisChapters = useAppSelector((state) => state.sickLeaveFilter.filter.diagnosisChapters)
  const dispatch = useAppDispatch()

  return (
    <DiagnosisFilter
      onChange={(chapters: DiagnosKapitel[]) => dispatch(update({ diagnosisChapters: chapters }))}
      allDiagnoses={populatedFilters?.allDiagnosisChapters ?? []}
      enabledDiagnoses={populatedFilters?.enabledDiagnosisChapters ?? []}
      selected={diagnosisChapters}
      description="Filtrerar på den diagnos som skrivs ut först för sjukfallet uppdelat på kapitel. Diagnoskapitel som saknar data är inte valbara."
    />
  )
}
