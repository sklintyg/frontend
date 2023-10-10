interface GraphLegend {
  label: string
  color?: string
}

export function ChartLegend({ data }: { data: GraphLegend[] }) {
  return (
    <div className="w-full text-sm text-neutral-20">
      {data.map(({ label, color }) => (
        <div key={label}>
          <div className="mr-2 inline-block h-3 w-3 rounded-full " style={{ backgroundColor: color }} />
          {label}
        </div>
      ))}
    </div>
  )
}
