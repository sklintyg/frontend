import { forwardRef, Ref } from 'react'
import { useSelector } from 'react-redux'
import {
  getIsCertificateRenewed,
  getPredictionDiagnosisCode,
  getPredictionDiagnosisDescription,
  getRiskOpinion,
  getSickLeaveChoice,
  getSrsPredictions,
} from '../../../store/srs/srsSelectors'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, LabelProps, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { getCurrentRiskDataPoint, getPreviousRiskDataPoint, getRiskDataPoint, RISK_LABELS } from '../srsUtils'
import { Payload } from 'recharts/types/component/DefaultTooltipContent'

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
  const hasValue = value && value > 0

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
      <BarChart width={500} height={300} data={getData()}>
        <CartesianGrid stroke="#ccc" vertical={false} />
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
      </BarChart>
    </div>
  )
})

export default SrsRiskGraph
