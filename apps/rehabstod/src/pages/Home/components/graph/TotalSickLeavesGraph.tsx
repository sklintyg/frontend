import { IDSIconQuestion } from '@frontend/ids-react-ts'
import { format } from 'date-fns'
import { LabelProps, Pie, PieChart } from 'recharts'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'

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
      <h2 className="ids-heading-4">
        Antal sjukfall{' '}
        <TooltipIcon
          description={`Antal sjukfall just nu, ${format(new Date(), 'yyyy-MM-dd, HH:mm')}`}
          icon={
            <IDSIconQuestion size="s" className="relative top-1" color="currentColor" color2="currentColor" data-testid="tooltipIcon" />
          }
        />
      </h2>
      <div>
        <PieChart width={120} height={200} className="m-auto">
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
