import { SickLeaveSummary } from '../../../schemas/sickLeaveSchema'
import { SickLeaveDegreeGraph } from './SickLeaveDegreeGraph'

export function SickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  return (
    <>
      <h2 className="ids-heading-4">Aktuell sjukskrivningsgrad</h2>
      <p>Hur stor andel av sjukfallen som tillhör en viss sjukskrivningsgrad.</p>
      <div className="flex justify-between">
        <SickLeaveDegreeGraph sickLeaveDegrees={summary.sickLeaveDegrees} />
        <div className="flex">
          <div>
            <p className="ids-heading-4 text-center">Män</p>
            <SickLeaveDegreeGraph sickLeaveDegrees={summary.maleSickLeaveDegrees} small />
          </div>
          <div>
            <p className="ids-heading-4 text-center">Kvinnor</p>
            <SickLeaveDegreeGraph sickLeaveDegrees={summary.femaleSickLeaveDegrees} small />
          </div>
        </div>
      </div>
    </>
  )
}
