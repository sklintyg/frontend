import { Heading, Icon, TooltipIcon } from '@frontend/components'
import { format } from 'date-fns'
import type { LabelProps } from 'recharts'
import { Pie, PieChart } from 'recharts'

function renderCustomizedLabel(props: LabelProps) {
  const { value } = props
  return (
    <text x="50%" y="50%" fill="black" textAnchor="middle" dominantBaseline="central">
      {`${value} st`}
    </text>
  )
}

export function TotalSickLeavesGraph({ total }: { total: number }) {
  const data = [
    {
      name: 'Total',
      value: total,
    },
  ]

  if (!total) {
    return null
  }

  return (
    <>
      <Heading level={3} size="s">
        Antal sjukfall{' '}
        <TooltipIcon
          description={`Antal sjukfall just nu, ${format(new Date(), 'yyyy-MM-dd, HH:mm')}`}
          icon={<Icon icon="information" className="relative top-1" data-testid="tooltipIcon" colorPreset={1} />}
        />
      </Heading>
      <div>
        <PieChart width={128} height={208} className="m-auto">
          <Pie
            isAnimationActive={false}
            data={data}
            color="#000000"
            dataKey="value"
            nameKey="name"
            outerRadius={60}
            fill="var(--ids-color-interactive-background-default)"
            label={renderCustomizedLabel}
            labelLine={false}
            stroke="none"
          />
        </PieChart>
      </div>
    </>
  )
}
