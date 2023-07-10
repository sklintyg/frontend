import { SickLeaveLengthSummary, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'
import { Gender } from '../../../../schemas/patientSchema'
import { getGenderText } from '../../statisticsUtils'

export function SickLeaveLengthsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (length: SickLeaveLengthSummary, index: number, gender: Gender) => ({
    id: length.id.toString(),
    value: Math.round(length.percentage),
    name: `${length.name} (${length.count} st, ${Math.round(length.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(length.percentage)}% (${length.count} st) av sjukfallen ${getGenderText(
      gender
    )} har en sjukskrivningslängd på ${length.name.replace('Dag', '').concat(' dagar')}.`,
  })

  const generateData = (lengths: SickLeaveLengthSummary[], gender: Gender) =>
    lengths.map((length, index) => getDataPoint(length, index, gender))
  const parentData = generateData(summary.sickLeaveLengths)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleSickLeaveLengths, Gender.M)}
      femaleData={generateData(summary.femaleSickLeaveLengths, Gender.F)}
      title="Sjukskrivningslängd"
      subTitle="Sjukfall fördelat på sjukskrivningslängd"
    />
  )
}
