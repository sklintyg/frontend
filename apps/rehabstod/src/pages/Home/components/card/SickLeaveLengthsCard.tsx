import { SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { SickLeaveLengthGraph } from '../graph/SickLeaveLengthGraph'

export function SickLeaveLengthsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  return (
    <>
      <h2 className="ids-heading-4">Sjukskrivningslängd</h2>
      <p>Se hur många och hur stor procentsats av sjukfallen som har en viss sjukskrivningslängd.</p>
      <div className="flex justify-between">
        <SickLeaveLengthGraph sickLeaveLengths={summary.sickLeaveLengths} />
        <div className="flex">
          <div>
            <p className="ids-heading-4 text-center">Män</p>
            <SickLeaveLengthGraph sickLeaveLengths={summary.maleSickLeaveLengths} small />
          </div>
          <div>
            <p className="ids-heading-4 text-center">Kvinnor</p>
            <SickLeaveLengthGraph sickLeaveLengths={summary.femaleSickLeaveLengths} small />
          </div>
        </div>
      </div>
    </>
  )
}
