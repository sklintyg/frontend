import { SickLeaveLengthSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'

export function SickLeaveLengthsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (length: SickLeaveLengthSummary, index: number) => ({
    id: length.id.toString(),
    value: Math.round(length.percentage),
    name: `${length.name} (${length.count} st, ${Math.round(length.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(length.percentage)}% (${length.count} st) av sjukfallen har en sjukskrivningslängd på ${length.name}.`,
  })

  const generateData = (lengths: SickLeaveLengthSummary[]) => lengths.map((length, index) => getDataPoint(length, index))
  const parentData = generateData(summary.sickLeaveLengths)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleSickLeaveLengths)}
      femaleData={generateData(summary.femaleSickLeaveLengths)}
      title="Sjukskrivningslängd"
      subTitle="Sjukfall fördelat på sjukskrivningslängd"
    />
  )
}
