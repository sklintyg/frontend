import { DiagnosisFilter } from '../../../../components/Table/filter/DiagnosisFilter'
import type { DiagnosKapitel } from '../../../../schemas/diagnosisSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

export function LUCertificateDiagnosisFilter({ options }: { options: DiagnosKapitel[] }) {
  const diagnoses = useAppSelector((state) => state.luCertificatesFilter.filter.diagnoses)
  const dispatch = useAppDispatch()

  return (
    <DiagnosisFilter
      onChange={(diagnosisChapters) => {
        dispatch(update({ diagnoses: diagnosisChapters.map((diagnosisChapter) => diagnosisChapter.id) }))
      }}
      allDiagnoses={options}
      enabledDiagnoses={options}
      selected={options.filter((diagnosis) => diagnoses.some((id) => diagnosis.id === id)) || []}
      description="Filtrerar på den diagnos som skrivs ut först för läkarutlåtandet uppdelat på kapitel."
    />
  )
}
