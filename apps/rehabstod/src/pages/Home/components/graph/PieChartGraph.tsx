import { Legend, Pie, PieChart } from 'recharts'

export function PieChartGraph({ data, small }: { data: { value: number; name: string; fill: string }[]; small?: boolean }) {
  return (
    <PieChart width={small ? 300 : 500} height={200}>
      <Legend
        layout={!small ? 'vertical' : undefined}
        verticalAlign={!small ? 'middle' : undefined}
        align={!small ? 'right' : undefined}
        className="text-xs"
        /* eslint-disable-next-line react/no-unstable-nested-components */
        formatter={(name) => <span className="text-neutral-40 text-xs">{name}</span>}
      />
      <Pie
        data={data}
        color="#000000"
        dataKey="value"
        nameKey="name"
        outerRadius={small ? 30 : 60}
        labelLine={false}
        stroke="white"
        className="mx-5"
      />
    </PieChart>
  )
}
