import { Gender, GenderSummary } from '../../../../schemas/sickLeaveSchema'
import { GenderGraph } from './GenderGraph'
import { idsGraphColors } from '../../assets/Colors'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const female = genders.find((gender) => gender.gender === Gender.F)
  const male = genders.find((gender) => gender.gender === Gender.M)

  if (!female || !male) {
    return null
  }

  return (
    <div>
      <h2 className="ids-heading-4">Könsfördelning totalt</h2>
      <div className="flex items-center justify-center">
        <GenderGraph gender={female} />
        <GenderGraph gender={male} />
      </div>
      <ul className="ml-5 list-disc">
        <li className="marker:text-3xl" style={{ color: idsGraphColors[4] }}>
          <span className="text-neutral-20 align-super text-sm">{`Kvinnor (${female.count} st, ${Math.round(female.percentage)} %)`}</span>
        </li>
        <li className="marker:text-3xl" style={{ color: idsGraphColors[3] }}>
          <span className="text-neutral-20 align-super text-sm">{`Män (${male.count} st, ${Math.round(male.percentage)}%)`}</span>
        </li>
      </ul>
    </div>
  )
}
