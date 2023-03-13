import React from 'react'
import { useSelector } from 'react-redux'
import { getSrsInfo } from '../../store/srs/srsSelectors'
import { LineChart, Line, XAxis, CartesianGrid, YAxis, Tooltip, TooltipProps } from 'recharts'

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="iu-bg-white iu-fs-100 iu-p-300 iu-border-grey-200">
        <p className="label">
          {label} dagar <span className="iu-fw-bold">{payload[0].value}%</span>
        </p>
      </div>
    )
  }

  return null
}

const SrsNationalStatistics: React.FC = () => {
  const srsInfo = useSelector(getSrsInfo)
  const statistics = srsInfo && srsInfo.statistikNationellStatistik.length > 0 ? srsInfo.statistikNationellStatistik : []
  const xLabels = [30, 90, 180, 365]
  const statisticsTotalNumber = statistics[statistics.length - 1]

  const data = xLabels.map((xLabel, index) => {
    return { name: xLabel, value: Math.round((statistics[index] / statisticsTotalNumber) * 100) }
  })

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#ccc" vertical={false} />
      <Line type="monotone" dataKey="value" stroke="#00706e" strokeWidth={3} />
      <XAxis
        type="number"
        dataKey="name"
        ticks={xLabels}
        tickFormatter={(tick) => {
          return `${tick} dagar`
        }}
      />
      <YAxis
        tickFormatter={(tick) => {
          return `${tick}%`
        }}
      />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  )
}

export default SrsNationalStatistics
