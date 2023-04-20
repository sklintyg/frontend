import { SickLeaveDegreeSummary } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from './PieChartGraph'

export function SickLeaveLengthGraph({ sickLeaveLengths, small }: { sickLeaveLengths: SickLeaveDegreeSummary[]; small?: boolean }) {
  const colors = ['var(--IDS-COLOR-ACCENT-40)', 'var(--IDS-COLOR-PRIMARY-40)', 'var(--IDS-COLOR-GRAPHIC)', 'var(--IDS-COLOR-ALTERNATIVE)']

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number) => ({
    value: Math.round(degree.percentage),
    name: `${degree.name} (${degree.count}st, ${Math.round(degree.percentage)}%)`,
    fill: colors[index % colors.length],
  })

  const data = sickLeaveLengths.map((degree, index) => getDataPoint(degree, index))

  return <PieChartGraph data={data} small={small} />
}
