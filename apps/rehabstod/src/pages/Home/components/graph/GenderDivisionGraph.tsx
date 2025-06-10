import { Heading } from '../../../../components/Heading/Heading'
import { Gender } from '../../../../schemas/patientSchema'
import type { GenderSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { ChartLegend } from './ChartLegend'
import { GenderGraph } from './GenderGraph'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const female = genders.find((gender) => gender.gender === Gender.F)
  const male = genders.find((gender) => gender.gender === Gender.M)

  if (!female || !male) {
    return null
  }

  return (
    <div>
      <Heading level={3} size="xs">
        Könsfördelning totalt
      </Heading>
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
