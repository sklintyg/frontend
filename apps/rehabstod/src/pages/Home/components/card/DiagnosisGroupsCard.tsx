import { SickLeaveSummary } from '../../../../schemas/sickLeaveSchema'
import { idsGraphColors } from '../../assets/Colors'
import { StatisticsCard } from './StatisticsCard'
import { DiagnosGruppStat } from '../../../../schemas/diagnosisSchema'
import { getGenderText } from '../../statisticsUtils'
import { Gender } from '../../../../schemas/patientSchema'

export function DiagnosisGroupsCard({ summary }: { summary: SickLeaveSummary | undefined }) {
  if (!summary) {
    return null
  }

  const getDataPoint = (group: DiagnosGruppStat, index: number, gender: Gender) => ({
    id: group.grupp.id,
    value: Math.round(group.percentage),
    name: `${group.grupp.id.replaceAll(',', ', ')} ${group.grupp.name} (${group.count} st, ${Math.round(group.percentage)}%)`,
    fill: idsGraphColors[index % idsGraphColors.length],
    tooltip: `${Math.round(group.percentage)}% (${group.count} st) av sjukfallen ${getGenderText(gender)} tillhör ${group.grupp.name}.`,
  })
  const generateData = (data: DiagnosGruppStat[], gender: Gender) => data.map((group, index) => getDataPoint(group, index, gender))

  const parentData = generateData(summary.groups)

  return (
    <StatisticsCard
      parentData={parentData}
      maleData={generateData(summary.maleDiagnosisGroups, Gender.M)}
      femaleData={generateData(summary.femaleDiagnosisGroups, Gender.F)}
      title="Diagnosgrupp"
      subTitle="Sjukfall fördelat på diagnosgrupp"
    />
  )
}
