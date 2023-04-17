import { Gender, GenderSummary } from '../../../schemas/sickLeaveSchema'
import { GenderGraph } from './GenderGraph'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const female = genders.find((gender) => gender.gender === Gender.F.toString())
  const male = genders.find((gender) => gender.gender === Gender.M.toString())

  return (
    <div>
      <h2 className="ids-heading-4">Könsfördelning totalt</h2>
      <div className="flex items-center justify-center gap-5">
        <GenderGraph gender={female} />
        <GenderGraph gender={male} />
      </div>
    </div>
  )
}
