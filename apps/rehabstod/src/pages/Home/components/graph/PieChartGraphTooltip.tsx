import { TooltipWrapper } from 'components'
import type { TooltipProps } from 'recharts'

export function PieChartGraphTooltip({ payload }: TooltipProps<string, string>) {
  if (payload && payload.length > 0) {
    return <TooltipWrapper>{payload[0].payload.tooltip}</TooltipWrapper>
  }

  return null
}
