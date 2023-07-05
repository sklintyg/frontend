import { SickLeaveDegreeSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'

export function SickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number) => ({
    id: degree.id.toString(),
    value: Math.round(degree.percentage),
    name: `${degree.id} % sjukskrivningsgrad (${degree.count} st, ${Math.round(degree.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(degree.percentage)}% (${degree.count} st) har en aktuell sjukskrivningsgrad på ${degree.id} %.`,
  })

  const generateData = (data: SickLeaveDegreeSummary[]) => data.map((group, index) => getDataPoint(group, index))

  return (
    <StatisticsCard
      parentData={generateData(summary.sickLeaveDegrees)}
      maleData={generateData(summary.maleSickLeaveDegrees)}
      femaleData={generateData(summary.femaleSickLeaveDegrees)}
      title="Aktuell sjukskrivningsgrad"
      subTitle="Sjukfall fördelat på aktuell sjukskrivningsgrad"
    />
  )
}
