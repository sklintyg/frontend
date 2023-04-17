import { LabelProps, Pie, PieChart } from 'recharts'
import { TooltipIcon } from '../../../components/TooltipIcon/TooltipIcon'

function renderCustomizedLabel(props: LabelProps) {
  const { value } = props
  return (
    <text x={150} y={100} fill="white" textAnchor="middle" dominantBaseline="central">
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

  return (
    <>
      <h2 className="ids-heading-4">
        Antal sjukfall{' '}
        <TooltipIcon
          description={`Antal sjukfall just nu ${Date.now()}`}
          name="question"
          size="s"
          className="relative top-1"
          color="neutral"
        />
      </h2>
      <div>
        <PieChart width={300} height={200} className="m-auto">
          <Pie
            data={data}
            color="#000000"
            dataKey="value"
            nameKey="name"
            outerRadius={70}
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
