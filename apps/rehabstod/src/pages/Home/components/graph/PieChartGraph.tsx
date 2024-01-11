import { classNames } from '@frontend/components'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartLegend } from './ChartLegend'
import { PieChartGraphTooltip } from './PieChartGraphTooltip'
import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'

export function PieChartGraph({
  data,
  isSmall = false,
  parentData,
  title,
}: {
  data: SummaryDataPoint[]
  parentData?: SummaryDataPoint[]
  isSmall?: boolean
  title?: string
}) {
  const formattedData = !parentData
    ? data
    : data.map((dataPoint) => ({ ...dataPoint, fill: parentData.find((point) => point.id === dataPoint.id)?.fill }))
  return (
    <div className="w-full">
      {title && <h4 className="font-bold md:text-center">{title}</h4>}
      <div className="flex items-start">
        <div className={classNames('flex flex-col items-center justify-items-center w-full', !isSmall && 'xl:flex-row')}>
          <ResponsiveContainer width={208} minWidth={208} className={classNames('h-52 w-52', isSmall && 'xl:h-28')}>
            <PieChart>
              <Pie
                isAnimationActive={false}
                cx="50%"
                cy="50%"
                data={formattedData}
                color="#000000"
                dataKey="value"
                nameKey="name"
                labelLine={false}
                stroke={formattedData.length > 1 ? 'white' : 'none'}
              />
              <Tooltip content={<PieChartGraphTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <ChartLegend data={formattedData.map(({ name, fill }) => ({ label: name, color: fill }))} />
        </div>
      </div>
    </div>
  )
}
