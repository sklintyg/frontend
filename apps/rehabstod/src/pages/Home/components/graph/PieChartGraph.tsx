import { classNames } from '@frontend/components'
import { Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'
import { TooltipWrapper } from '../../../../components/Tooltip/TooltipWrapper'
import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { ChartLegend } from './ChartLegend'

function CustomTooltip({ payload }: TooltipProps<string, string>) {
  if (payload && payload.length > 0) {
    return <TooltipWrapper>{payload[0].payload.tooltip}</TooltipWrapper>
  }

  return null
}

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
    <div className="relative w-full pt-6">
      <h4 className="absolute top-0 left-0 font-bold">{title}</h4>
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
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <ChartLegend data={formattedData.map(({ name, fill }) => ({ label: name, color: fill }))} />
        </div>
      </div>
    </div>
  )
}
