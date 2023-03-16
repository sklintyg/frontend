import React from 'react'
import { useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription } from '../../store/srs/srsSelectors'
import { SrsInformationChoice, InfoCircle } from '@frontend/common'
import SrsNationalStatisticsLineChart from './SrsNationalStatisticsLineChart'

export const SRS_STATISTICS_TITLE = 'Andel avslutade sjukskrivningsfall*'
export const SRS_STATISTICS_INFO = '*Sjukskrivningsfall som påbörjades 2017 (Källa: Försäkringskassan)'

const SrsNationalStatistics: React.FC = () => {
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.STATISTICS))
  const diagnosisDescription = useSelector(getDiagnosisDescription(SrsInformationChoice.STATISTICS))
  const infoTooltip = `Det SRS-stöd som visas är för koden ${diagnosisCode} - ${diagnosisDescription}.`

  return (
    <>
      <h3>{SRS_STATISTICS_TITLE}</h3>
      <p className="iu-fw-bold iu-mb-200">
        {diagnosisCode} {diagnosisDescription} <InfoCircle className="iu-ml-200" tooltip={infoTooltip} />
      </p>
      <SrsNationalStatisticsLineChart />
      <p>{SRS_STATISTICS_INFO}</p>
    </>
  )
}

export default SrsNationalStatistics
