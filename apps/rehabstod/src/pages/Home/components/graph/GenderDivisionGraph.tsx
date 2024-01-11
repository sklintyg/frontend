import { ChartLegend } from './ChartLegend'
import { GenderGraph } from './GenderGraph'
import { Gender } from '../../../../schemas/patientSchema'
import { GenderSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const female = genders.find((gender) => gender.gender === Gender.F)
  const male = genders.find((gender) => gender.gender === Gender.M)

  if (!female || !male) {
    return null
  }

  return (
    <div>
      <h3 className="ids-heading-4">Könsfördelning totalt</h3>
      <div className="mb-2 flex items-center justify-center">
        <GenderGraph gender={female} />
        <GenderGraph gender={male} />
      </div>
      <ChartLegend
        data={[
          { label: `Kvinnor (${female.count} st, ${Math.round(female.percentage)} %)`, color: idsGraphColors[4] },
          { label: `Män (${male.count} st, ${Math.round(male.percentage)}%)`, color: idsGraphColors[3] },
        ]}
      />
    </div>
  )
}
