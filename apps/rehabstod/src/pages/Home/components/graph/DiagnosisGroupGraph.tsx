import { DiagnosGruppStat } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from './PieChartGraph'

export function DiagnosisGroupGraph({ diagnosisGroups, small }: { diagnosisGroups: DiagnosGruppStat[]; small?: boolean }) {
  const colors = [
    'var(--IDS-COLOR-ACCENT-40)',
    'var(--IDS-COLOR-PRIMARY-40)',
    'var(--IDS-COLOR-GRAPHIC)',
    'var(--IDS-COLOR-ALTERNATIVE)',
    'var(--IDS-COLOR-ACCENT-30',
    'var(--IDS-COLOR-PRIMARY-30)',
    'var(--IDS-COLOR-NEUTRAL)',
  ]

  const getDataPoint = (group: DiagnosGruppStat, index: number) => ({
    value: Math.round(group.percentage),
    name: `${group.grupp.id} ${group.grupp.name} (${group.count}st, ${Math.round(group.percentage)}%)`,
    fill: colors[index],
  })

  const data = diagnosisGroups.map((group, index) => getDataPoint(group, index))

  return <PieChartGraph data={data} small={small} disableLegend />
}
