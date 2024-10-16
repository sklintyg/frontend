import type { Ref } from 'react'
import { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import type { LabelProps, TooltipProps } from 'recharts'
import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Payload } from 'recharts/types/component/DefaultTooltipContent'
import {
  getIsCertificateRenewed,
  getPredictionDiagnosisCode,
  getPredictionDiagnosisDescription,
  getRiskOpinion,
  getSickLeaveChoice,
  getSrsPredictions,
} from '../../../store/srs/srsSelectors'
import { getCurrentRiskDataPoint, getPreviousRiskDataPoint, getRiskDataPoint, RISK_LABELS } from '../srsUtils'

const CustomTooltip = ({ active, payload, label }: TooltipProps<string, string>) => {
  if (active && payload && payload.length) {
    return <div>{getTooltipContent(label, payload)}</div>
  }

  return null
}

const getTooltipContent = (label: string, payload: Payload<string, string>[]) => {
  const tooltipLabels = ['Riskberäkningen gäller', label, 'Beräknades', 'Läkarens bedömning']

  const values = [
    payload[0].payload.sickLeaveChoice,
    payload[0].value,
    payload[0].payload.timestamp ? payload[0].payload.timestamp.split('T')[0] : '',
    payload[0].payload.riskOpinion,
  ]

  const units = ['', '%', '', '']

  const tooltipStyling = 'iu-bg-white iu-fs-100 iu-p-300 iu-border-grey-200'

  if (label === RISK_LABELS[0]) {
    return <p className={tooltipStyling}>{getTooltipText(label, payload[0].value, '%')}</p>
  }

  if (!payload[0].value || payload[0].value === '-') {
    return (
      <div>
        <p className={tooltipStyling}>
          {getTooltipText(label, 'Ej beräknad')} <br />
          {payload[0].payload.tooltip}
        </p>
      </div>
    )
  }

  return (
    <div className={`${tooltipStyling} iu-flex-column`}>
      {values.map((value, index) => {
        return <div key={`tooltip-content-${index}`}>{value ? getTooltipText(tooltipLabels[index], value, units[index]) : ''}</div>
      })}
    </div>
  )
}

const getTooltipText = (label: string, value: string | number | undefined, unit?: string) => {
  return (
    <>
      <span className="iu-fw-bold">{label}: </span>
      {value}
      {unit}
    </>
  )
}

const CustomizedLabel = (props: LabelProps) => {
  const { x, y, stroke, width, value } = props
  const hasValue = value != null && value !== '-'

  return (
    <text x={x} y={y} dy={-10} dx={(width as number) / 2} fill={stroke} fontSize={hasValue ? 12 : 20} textAnchor="middle">
      {value}
      {hasValue && '%'}
    </text>
  )
}

const SrsRiskGraph = forwardRef((_: unknown, ref: Ref<HTMLDivElement>) => {
  const predictions = useSelector(getSrsPredictions)
  const riskOpinion = useSelector(getRiskOpinion)
  const isCertificateRenewal = useSelector(getIsCertificateRenewed)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const diagnosisCode = useSelector(getPredictionDiagnosisCode)
  const diagnosisDescription = useSelector(getPredictionDiagnosisDescription)
  const barColors = ['#00706e', '#01a5a3', '#a1958a']

  const getData = () => {
    if (!(predictions && predictions.length > 0)) {
      return []
    }

    const averageDataPoint = getRiskDataPoint(RISK_LABELS[0], predictions[0].prevalence, sickLeaveChoice)
    const currentDataPoint = getCurrentRiskDataPoint(sickLeaveChoice, predictions, riskOpinion)
    const previousDataPoint = getPreviousRiskDataPoint(predictions, sickLeaveChoice)

    return isCertificateRenewal ? [averageDataPoint, previousDataPoint, currentDataPoint] : [averageDataPoint, currentDataPoint]
  }

  return (
    <div ref={ref}>
      <p className="iu-fw-bold">
        Risken gäller {diagnosisCode} {diagnosisDescription}
      </p>
      <ResponsiveContainer width="100%" height="100%" minHeight="300px">
        <BarChart data={getData()} margin={{ right: 80 }}>
          <XAxis dataKey="name" />
          <YAxis
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(tick) => {
              return `${tick}%`
            }}
          />
          <Bar dataKey="risk" fill="#e0e0e0" isAnimationActive={false}>
            {getData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index]} />
            ))}
            <LabelList content={<CustomizedLabel />} />
          </Bar>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <ReferenceLine
            y={39}
            label={{ position: 'insideTopRight', value: 'Måttlig risk', fill: '#5F5F5F', angle: -45, dx: 55 }}
            stroke="#ccc"
          />
          <ReferenceLine
            y={62}
            label={{ position: 'insideTopRight', value: 'Hög risk', fill: '#5F5F5F', angle: -45, dx: 45 }}
            stroke="#ccc"
          />
          <ReferenceLine
            y={100}
            label={{ position: 'insideTopRight', value: 'Mycket hög risk', fill: '#5F5F5F', dx: 70, angle: -45 }}
            stroke="#ccc"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

export default SrsRiskGraph
