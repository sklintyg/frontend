import { Legend, Pie, PieChart } from 'recharts'
import { SickLeaveDegreeSummary } from '../../../schemas/sickLeaveSchema'

export function SickLeaveDegreeGraph({
                                       sickLeaveDegrees,
                                       small,
                                     }: { sickLeaveDegrees: SickLeaveDegreeSummary[]; small?: boolean }) {
  const colors = ['var(--IDS-COLOR-ACCENT-40)', 'var(--IDS-COLOR-PRIMARY-40)', 'var(--IDS-COLOR-GRAPHIC)', 'var(--IDS-COLOR-ALTERNATIVE)']

  const getDataPoint = (degree: SickLeaveDegreeSummary, index: number) => ({
    value: Math.round(degree.percentage),
    name: `${degree.id} % sjukskrivningsgrad (${degree.count}st, ${Math.round(degree.percentage)}%)`,
    fill: colors[index],
  })

  const data = sickLeaveDegrees.map((degree, index) => getDataPoint(degree, index))

  return (
    <div>
      <PieChart width={small ? 300 : 500} height={200}>
        <Legend
          layout={!small ? 'vertical' : undefined}
          verticalAlign={!small ? 'middle' : undefined}
          align={!small ? 'right' : undefined}
          className='text-xs'
          {/* eslint-disable-next-line react/no-unstable-nested-components */}
          formatter={(name) => <span className='text-neutral-40 text-xs'>{name}</span>}
        />
        <Pie
          data={data}
          color='#000000'
          dataKey='value'
          nameKey='name'
          outerRadius={small ? 30 : 60}
          labelLine={false}
          stroke='none'
          className='mx-5'
        />
      </PieChart>
    </div>
  )
}
