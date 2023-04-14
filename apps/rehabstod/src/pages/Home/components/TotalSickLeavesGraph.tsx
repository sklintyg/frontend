import { LabelProps, Pie, PieChart } from 'recharts'
import { useGetSickLeavesSummaryQuery } from '../../../store/api'

function renderCustomizedLabel(props: LabelProps) {
  const { value } = props
  return (
    <text x={150} y={100} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${value} st`}
    </text>
  )
}

export function TotalSickLeavesGraph() {
  const { data: summary } = useGetSickLeavesSummaryQuery()

  if (!summary) {
    return null
  }

  const data = [
    {
      name: 'Total',
      value: summary.total,
    },
  ]

  return (
    <>
      <h2 className="ids-heading-4">Antal sjukfall</h2>
      <PieChart width={300} height={200} className="m-auto">
        <Pie
          data={data}
          color="#000000"
          dataKey="value"
          nameKey="name"
          outerRadius={70}
          fill="#40775E"
          label={renderCustomizedLabel}
          labelLine={false}
          stroke="none"
        />
      </PieChart>
    </>
  )
}
