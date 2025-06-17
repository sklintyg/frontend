import { Heading } from '../../../../components/Heading/Heading'
import { Gender } from '../../../../schemas/patientSchema'
import type { GenderSummary } from '../../../../schemas/sickLeaveSchema'
import { FemaleIcon } from '../../assets/FemaleIcon'
import { MaleIcon } from '../../assets/MaleIcon'
import { ChartLegend } from './ChartLegend'
import { GenderGraph } from './GenderGraph'

const femaleColor = '#FB8001'
const maleColor = '#5B224E'

export function GenderDivisionGraph({ genders }: { genders: GenderSummary[] }) {
  const female = genders.find((gender) => gender.gender === Gender.F)
  const male = genders.find((gender) => gender.gender === Gender.M)

  if (!female || !male) {
    return null
  }

  return (
    <div>
      <Heading level={3} size="s">
        Könsfördelning totalt
      </Heading>
      <div className="mb-2 flex items-center justify-center">
        <GenderGraph percentage={female.percentage} color={femaleColor}>
          <FemaleIcon fill={femaleColor} />
        </GenderGraph>
        <GenderGraph percentage={male.percentage} color={maleColor}>
          <MaleIcon fill={maleColor} />
        </GenderGraph>
      </div>
      <ChartLegend
        data={[
          { label: `Kvinnor (${female.count} st, ${Math.round(female.percentage)} %)`, color: femaleColor },
          { label: `Män (${male.count} st, ${Math.round(male.percentage)}%)`, color: maleColor },
        ]}
      />
    </div>
  )
}
