import { Gender } from '../../../../schemas/patientSchema'
import { SickLeaveDegreeSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { getGenderText } from '../../statisticsUtils'
import { StatisticsCard } from './StatisticsCard'

export function CountSickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number, gender?: Gender) => ({
    id: degree.id.toString(),
    value: Math.round(degree.percentage),
    name: `${degree.name} sjukskrivningsgrad i aktuellt intyg (${degree.count} st, ${Math.round(degree.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(degree.percentage)}% (${degree.count} st) av sjukfallen ${getGenderText(gender)} har ${degree.name} ${
      degree.name === 'En' ? 'sjukskrivningsgrad' : 'sjukskrivningsgrader'
    } i aktuellt intyg.`,
  })

  const generateData = (degrees: SickLeaveDegreeSummary[], gender?: Gender) =>
    degrees.map((degree, index) => getDataPoint(degree, index, gender))
  const parentData = generateData(summary.countSickLeaveDegrees)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.countMaleSickLeaveDegrees, Gender.M)}
      femaleData={generateData(summary.countFemaleSickLeaveDegrees, Gender.F)}
      title="Flera sjukskrivningsgrader"
      subTitle="Sjukfall fördelat på om aktuellt intyg innehåller en eller flera sjukskrivningsgrader"
    />
  )
}
