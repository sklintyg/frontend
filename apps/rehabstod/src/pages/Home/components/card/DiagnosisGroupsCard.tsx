import { DiagnosGruppStat, SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'

export function DiagnosisGroupsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (group: DiagnosGruppStat, index: number) => ({
    id: group.grupp.id,
    value: Math.round(group.percentage),
    name: `${group.grupp.id ? group.grupp.id.replaceAll(',', ', ') : group.grupp.name} (${group.count} st, ${Math.round(
      group.percentage
    )}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    description: group.grupp.id ? group.grupp.name : '',
  })
  const generateData = (data: DiagnosGruppStat[]) => data.map((group, index) => getDataPoint(group, index))

  const parentData = generateData(summary.groups)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleDiagnosisGroups)}
      femaleData={generateData(summary.femaleDiagnosisGroups)}
      title="Diagnosgrupp"
      subTitle="Hur stor andel av sjukfallen som tillhör en viss diagnosgrupp."
    />
  )
}
