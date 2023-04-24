import { Legend, Pie, PieChart } from 'recharts'
import { useEffect, useState } from 'react'

export function PieChartGraph({ data }: { data: { id: string; value: number; name: string; fill: string }[] }) {
  const [loaded, setLoaded] = useState(false)
  const getLegend = (name: string) => <span className="text-neutral-20 text-xs">{name}</span>

  // Fix for: https://github.com/recharts/recharts/issues/511
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 0)
  }, [])

  return (
    <PieChart width={500} height={200}>
      <Pie
        isAnimationActive={false}
        cx="100"
        cy="100"
        data={data}
        color="#000000"
        dataKey="value"
        nameKey="name"
        outerRadius={60}
        labelLine={false}
        stroke={data.length > 1 ? 'white' : 'none'}
      />
      <Legend layout="vertical" verticalAlign="middle" align="right" className="text-xs" formatter={(name) => getLegend(name)} />
    </PieChart>
  )
}
