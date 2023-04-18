import { SickLeaveSummary } from '../../../schemas/sickLeaveSchema'
import { CountSickLeaveDegreeGraph } from './CountSickLeaveDegreeGraph'

export function CountSickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  return (
    <>
      <h2 className="ids-heading-4">Sjukfall med fler än en sjukskrivningsgrad</h2>
      <p>Visar hur stor del av sjukfallen som har fler än en sjukskrivningsgrad.</p>
      <div className="flex justify-between">
        <CountSickLeaveDegreeGraph sickLeaveDegrees={summary.countSickLeaveDegrees} />
        <div className="flex">
          <div>
            <p className="ids-heading-4 text-center">Män</p>
            <CountSickLeaveDegreeGraph sickLeaveDegrees={summary.countMaleSickLeaveDegrees} small />
          </div>
          <div>
            <p className="ids-heading-4 text-center">Kvinnor</p>
            <CountSickLeaveDegreeGraph sickLeaveDegrees={summary.countFemaleSickLeaveDegrees} small />
          </div>
        </div>
      </div>
    </>
  )
}
