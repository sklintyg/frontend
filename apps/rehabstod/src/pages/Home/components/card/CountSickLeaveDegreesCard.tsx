import { SickLeaveDegreeSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'

export function CountSickLeaveDegreesCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number) => ({
    id: degree.id.toString(),
    value: Math.round(degree.percentage),
    name: `${degree.name} (${degree.count} st, ${Math.round(degree.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
  })

  const generateData = (degrees: SickLeaveDegreeSummary[]) => degrees.map((degree, index) => getDataPoint(degree, index))
  const parentData = generateData(summary.countSickLeaveDegrees)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.countMaleSickLeaveDegrees)}
      femaleData={generateData(summary.countFemaleSickLeaveDegrees)}
      title="Sjukfall med fler än en sjukskrivningsgrad"
      subTitle="Visar hur stor del av sjukfallen som har fler än en sjukskrivningsgrad."
    />
  )
}
