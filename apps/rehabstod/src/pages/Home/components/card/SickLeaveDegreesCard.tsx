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
  })

  const generateData = (data: SickLeaveDegreeSummary[]) => data.map((group, index) => getDataPoint(group, index))

  const parentData = generateData(summary.sickLeaveDegrees)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleSickLeaveDegrees)}
      femaleData={generateData(summary.femaleSickLeaveDegrees)}
      title="Aktuell sjukskrivningsgrad"
      subTitle="Andel sjukfall fördelat på sjukskrivningsgrad."
    />
  )
}
