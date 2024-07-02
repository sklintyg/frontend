import type { SickLeaveDegreeSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'
import { getGenderText } from '../../statisticsUtils'
import { Gender } from '../../../../schemas/patientSchema'

export function SickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number, gender?: Gender) => ({
    id: degree.id.toString(),
    value: Math.round(degree.percentage),
    name: `${degree.id} % sjukskrivningsgrad (${degree.count} st, ${Math.round(degree.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(degree.percentage)}% (${degree.count} st) av sjukfallen ${getGenderText(
      gender
    )} har en aktuell sjukskrivningsgrad på ${degree.id} %.`,
  })

  const generateData = (data: SickLeaveDegreeSummary[], gender?: Gender) => data.map((group, index) => getDataPoint(group, index, gender))

  return (
    <StatisticsCard
      parentData={generateData(summary.sickLeaveDegrees)}
      maleData={generateData(summary.maleSickLeaveDegrees, Gender.M)}
      femaleData={generateData(summary.femaleSickLeaveDegrees, Gender.F)}
      title="Aktuell sjukskrivningsgrad"
      subTitle="Sjukfall fördelat på aktuell sjukskrivningsgrad"
    />
  )
}
