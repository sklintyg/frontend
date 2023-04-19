import { Legend, Pie, PieChart } from 'recharts'
import { useEffect, useState } from 'react'

export function PieChartGraph({
  data,
  small,
  disableLegend,
}: {
  data: { value: number; name: string; fill: string }[]
  small?: boolean
  disableLegend?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const getLegend = (name: string) => <span className="text-neutral-40 text-xs">{name}</span>

  // Fix for: https://github.com/recharts/recharts/issues/511
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 0)
  }, [])

  return (
    <PieChart width={small ? 300 : 500} height={200}>
      <Pie
        isAnimationActive={false}
        data={data}
        color="#000000"
        dataKey="value"
        nameKey="name"
        outerRadius={small ? 30 : 60}
        labelLine={false}
        stroke="white"
      />
      {!disableLegend && (
        <Legend
          layout={!small ? 'vertical' : undefined}
          verticalAlign={!small ? 'middle' : undefined}
          align={!small ? 'right' : undefined}
          className="text-xs"
          formatter={(name) => getLegend(name)}
        />
      )}
    </PieChart>
  )
}
