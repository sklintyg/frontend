import { Gender, GenderSummary } from '../../../schemas/sickLeaveSchema'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const getSpeechBubble = (className: string, gender: GenderSummary | undefined) => (
    <svg width="100" height="75">
      <rect width="100" height="60" className={className} />
      <polygon transform="translate(100,90) rotate(180 00 0)" points="50 15, 100 100, 0 100" className={className} />
      <text x="37" y="35" className="fill-white">
        {`${Math.round(gender ? gender.percentage : 0)} %`}
      </text>
    </svg>
  )

  return (
    <div>
      <h2 className="ids-heading-4">Könsfördelning totalt</h2>
      <div className="flex items-center justify-center gap-5">
        <div className="flex-col">
          {getSpeechBubble(
            'fill-accent-40',
            genders.find((gender) => gender.gender === Gender.F.toString())
          )}
          <span className="material-symbols-outlined text-accent-40 text-8xl" data-testid="iconFemale">
            woman
          </span>
        </div>
        <div>
          {getSpeechBubble(
            'fill-primary-40',
            genders.find((gender) => gender.gender === Gender.M.toString())
          )}
          <span className="material-symbols-outlined text-primary-40 text-8xl" data-testid="iconMale">
            man
          </span>
        </div>
      </div>
    </div>
  )
}
