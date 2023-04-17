import { Gender, GenderSummary } from '../../../schemas/sickLeaveSchema'

export function GenderGraph({ gender }: { gender: GenderSummary | undefined }) {
  if (!gender) {
    return null
  }
  const isFemale = gender.gender === Gender.F

  return (
    <div>
      <svg width="100" height="75">
        <rect width="100" height="60" className={isFemale ? 'fill-accent-40' : 'fill-primary-40'} />
        <polygon
          transform="translate(100,90) rotate(180 00 0)"
          points="50 15, 100 100, 0 100"
          className={isFemale ? 'fill-accent-40' : 'fill-primary-40'}
        />
        <text x="37" y="35" className="fill-white">
          {`${Math.round(gender ? gender.percentage : 0)} %`}
        </text>
      </svg>
      <span
        className={`material-symbols-outlined ${isFemale ? 'text-accent-40' : 'text-primary-40'} text-8xl`}
        data-testid={`${isFemale ? 'iconFemale' : 'iconMale'}`}>
        {isFemale ? 'woman' : 'man'}
      </span>
    </div>
  )
}
