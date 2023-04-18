import { SickLeaveDegreeSummary } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from './PieChartGraph'

export function SickLeaveDegreeGraph({ sickLeaveDegrees, small }: { sickLeaveDegrees: SickLeaveDegreeSummary[]; small?: boolean }) {
  const colors = ['var(--IDS-COLOR-ACCENT-40)', 'var(--IDS-COLOR-PRIMARY-40)', 'var(--IDS-COLOR-GRAPHIC)', 'var(--IDS-COLOR-ALTERNATIVE)']

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number) => ({
    value: Math.round(degree.percentage),
    name: `${degree.id} % sjukskrivningsgrad (${degree.count}st, ${Math.round(degree.percentage)}%)`,
    fill: colors[index],
  })

  const data = sickLeaveDegrees.map((degree, index) => getDataPoint(degree, index))

  return <PieChartGraph data={data} small={small} />
}
