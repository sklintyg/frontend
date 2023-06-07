import { useEffect, useState } from 'react'
import { Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import classes from './PieChartGraph.css'

export function PieChartGraph({ data }: { data: { id: string; value: number; name: string; fill: string }[] }) {
  const [, setLoaded] = useState(false)
  const getLegend = (name: string) => <span className="text-neutral-20 text-sm">{name}</span>

  // Fix for: https://github.com/recharts/recharts/issues/511
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 0)
  }, [])

  return (
    <ResponsiveContainer width={500} height="100%" minHeight="150px" className={classes}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          cx="100"
          data={data}
          color="#000000"
          dataKey="value"
          nameKey="name"
          outerRadius={60}
          labelLine={false}
          stroke={data.length > 1 ? 'white' : 'none'}
        />
        <Legend
          iconType="circle"
          iconSize={11}
          wrapperStyle={{ width: 300, whiteSpace: 'break-spaces' }}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          className="pb-3"
          formatter={(name) => getLegend(name)}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
