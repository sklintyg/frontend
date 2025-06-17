import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Heading } from '../../../../components/Heading/Heading'
import type { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { classNames } from '../../../../utils/classNames'
import { ChartLegend } from './ChartLegend'
import { PieChartGraphTooltip } from './PieChartGraphTooltip'

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
      {title && (
        <Heading level={4} size="xs" className="text-center">
          {title}
        </Heading>
      )}
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
