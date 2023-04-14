import { useGetSickLeavesSummaryQuery } from '../../../store/api'
import { GenderSummary } from '../../../schemas/sickLeaveSchema'

export function GenderDivisionGraph() {
  const { data: summary } = useGetSickLeavesSummaryQuery()

  if (!summary) {
    return null
  }

  const getSpeechBubble = (className: string, gender: GenderSummary) => (
    <svg width="100" height="75">
      <rect width="100" height="60" className={className} />
      <polygon transform="translate(100,90) rotate(180 00 0)" points="50 15, 100 100, 0 100" className={className} />
      <text x="37" y="35" className="fill-white">
        {`${Math.round(gender.percentage)} %`}
      </text>
    </svg>
  )

  return (
    <div>
      <h2 className="ids-heading-4">Könsfördelning totalt</h2>
      <div className="flex items-center justify-center gap-5">
        <div className="flex-col">
          {getSpeechBubble('fill-accent-40', summary.genders[0])}
          <span className="material-symbols-outlined text-accent-40 text-8xl">woman</span>
        </div>
        <div>
          {getSpeechBubble('fill-primary-40', summary.genders[1])}
          <span className="material-symbols-outlined text-primary-40 text-8xl">man</span>
        </div>
      </div>
    </div>
  )
}
