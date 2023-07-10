import { useEffect, useState } from 'react'
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'
import classes from './PieChartGraph.css'
import { TooltipWrapper } from '../../../../components/Tooltip/TooltipWrapper'

function CustomTooltip({ payload }: TooltipProps<string, string>) {
  if (payload && payload.length > 0) {
    return <TooltipWrapper>{payload[0].payload.tooltip}</TooltipWrapper>
  }

  return null
}

export function PieChartGraph({
  data,
  isSmall,
  parentData,
}: {
  data: { id: string; value: number; name: string; fill: string; tooltip: string }[]
  parentData?: { id: string; value: number; name: string; fill: string; tooltip: string }[]
  isSmall?: boolean
}) {
  const [, setLoaded] = useState(false)
  const getLegend = (name: string) => <span className="text-neutral-20 text-sm">{name}</span>

  // Fix for: https://github.com/recharts/recharts/issues/511
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 0)
  }, [])

  const formattedData = !parentData
    ? data
    : data.map((dataPoint) => ({ ...dataPoint, fill: parentData.find((point) => point.id === dataPoint.id)?.fill }))

  return (
    <ResponsiveContainer width={isSmall ? 150 : 500} height="91%" minHeight="150px" className={classes}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
        <Pie
          isAnimationActive={false}
          cx={isSmall ? 50 : 100}
          cy={isSmall ? 50 : ''}
          data={formattedData}
          color="#000000"
          dataKey="value"
          nameKey="name"
          outerRadius={isSmall ? 30 : 60}
          labelLine={false}
          stroke={formattedData.length > 1 ? 'white' : 'none'}
          margin={0}
        />
        <Legend
          iconType="circle"
          iconSize={11}
          wrapperStyle={{ width: 300, whiteSpace: 'break-spaces' }}
          layout="vertical"
          verticalAlign={isSmall ? 'bottom' : 'middle'}
          align={isSmall ? 'center' : 'right'}
          className="pb-3"
          formatter={(name) => getLegend(name)}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
