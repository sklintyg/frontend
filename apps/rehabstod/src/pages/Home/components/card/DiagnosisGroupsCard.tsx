import { SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { DiagnosisGroupGraph } from '../graph/DiagnosisGroupGraph'

export function DiagnosisGroupsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  return (
    <>
      <h2 className="ids-heading-4">Diagnosgrupp</h2>
      <p>Hur stor andel av sjukfallen som tillhör en viss diagnosgrupp.</p>
      <div className="flex justify-between">
        <DiagnosisGroupGraph diagnosisGroups={summary.groups} />
        <div className="flex">
          <div>
            <p className="ids-heading-4 text-center">Män</p>
            <DiagnosisGroupGraph diagnosisGroups={summary.maleDiagnosisGroups} small />
          </div>
          <div>
            <p className="ids-heading-4 text-center">Kvinnor</p>
            <DiagnosisGroupGraph diagnosisGroups={summary.femaleDiagnosisGroups} small />
          </div>
        </div>
      </div>
    </>
  )
}
