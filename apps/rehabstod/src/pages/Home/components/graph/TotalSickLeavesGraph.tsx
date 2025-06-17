import { IDSIconInformation } from '@inera/ids-react'
import { format } from 'date-fns'
import type { LabelProps } from 'recharts'
import { Pie, PieChart } from 'recharts'
import { Heading } from '../../../../components/Heading/Heading'
import { TooltipIcon } from '../../../../components/Tooltip'

function renderCustomizedLabel(props: LabelProps) {
  const { value } = props
  return (
    <text x="50%" y="50%" fill="white" textAnchor="middle" dominantBaseline="central">
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
          icon={
            <IDSIconInformation size="s" className="relative top-1" color="currentColor" color2="currentColor" data-testid="tooltipIcon" />
          }
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
            fill="var(--IDS-COLOR-ACCENT-40)"
            label={renderCustomizedLabel}
            labelLine={false}
            stroke="none"
          />
        </PieChart>
      </div>
    </>
  )
}
