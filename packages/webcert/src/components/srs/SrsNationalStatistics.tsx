import React from 'react'
import { useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription, getSrsInfo } from '../../store/srs/srsSelectors'
import { SrsInformationChoice, InfoCircle } from '@frontend/common'
import { LineChart, Line, XAxis, CartesianGrid, YAxis, Tooltip } from 'recharts'

export const SRS_STATISTICS_TITLE = 'Andel avslutade sjukskrivningsfall*'
export const SRS_STATISTICS_INFO = '*Sjukskrivningsfall som påbörjades 2017 (Källa: Försäkringskassan)'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">
          {label} dagar <span className="iu-fw-bold">{payload[0].value}%</span>
        </p>
      </div>
    )
  }

  return null
}

interface Data {
  name: number
  value: number
}
const SrsNationalStatistics: React.FC = () => {
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.STATISTICS))
  const diagnosisDescription = useSelector(getDiagnosisDescription(SrsInformationChoice.STATISTICS))
  const infoTooltip = `Det SRS-stöd som visas är för koden ${diagnosisCode} - ${diagnosisDescription}.`
  const srsInfo = useSelector(getSrsInfo)
  const statistics =
    srsInfo && srsInfo.statistikNationellStatistik.length > 0 ? srsInfo.statistikNationellStatistik : [13432, 37494, 50517, 62952, 71240]

  const generateData = (values: number[], totalNumber: number) => {
    const xLabels = [30, 90, 180, 365]
    const data: Data[] = []

    xLabels.forEach((xLabel, index) => {
      data.push({ name: xLabel, value: Math.round((values[index] / totalNumber) * 100) })
    })

    return data
  }

  const getLineChart = () => {
    return (
      <LineChart width={500} height={300} data={generateData(statistics, statistics[statistics.length - 1])}>
        <CartesianGrid stroke="#ccc" vertical={false} />
        <Line type="monotone" dataKey="value" stroke="#00706e" strokeWidth={3} />
        <XAxis
          type="number"
          dataKey="name"
          ticks={[30, 90, 180, 365]}
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

  return (
    <>
      <h3>{SRS_STATISTICS_TITLE}</h3>
      <p className="iu-fw-bold iu-mb-200">
        {diagnosisCode} {diagnosisDescription} <InfoCircle className="iu-ml-200" tooltip={infoTooltip} />
      </p>
      {getLineChart()}
      <p>{SRS_STATISTICS_INFO}</p>
    </>
  )
}

export default SrsNationalStatistics
