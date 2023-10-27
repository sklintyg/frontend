import { TooltipWrapper } from '@frontend/components'
import { TooltipProps } from 'recharts'

export function PieChartGraphTooltip({ payload }: TooltipProps<string, string>) {
  if (payload && payload.length > 0) {
    return <TooltipWrapper>{payload[0].payload.tooltip}</TooltipWrapper>
  }

  return null
}
