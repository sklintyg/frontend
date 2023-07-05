import { SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'
import { DiagnosGruppStat } from '../../../../schemas/diagnosisSchema'

export function DiagnosisGroupsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (group: DiagnosGruppStat, index: number) => ({
    id: group.grupp.id,
    value: Math.round(group.percentage),
    name: `${group.grupp.id.replaceAll(',', ', ')} ${group.grupp.name} (${group.count} st, ${Math.round(group.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(group.percentage)}% (${group.count} st) av sjukfallen tillhör ${group.grupp.name}.`,
  })
  const generateData = (data: DiagnosGruppStat[]) => data.map((group, index) => getDataPoint(group, index))

  const parentData = generateData(summary.groups)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleDiagnosisGroups)}
      femaleData={generateData(summary.femaleDiagnosisGroups)}
      title="Diagnosgrupp"
      subTitle="Sjukfall fördelat på diagnosgrupp"
    />
  )
}
