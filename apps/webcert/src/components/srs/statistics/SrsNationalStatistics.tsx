import { InfoCircle } from '../../../images'
import { getDiagnosisCode, getDiagnosisDescription } from '../../../store/srs/srsSelectors'
import { useAppSelector } from '../../../store/store'
import { SrsInformationChoice } from '../../../types'
import SrsNationalStatisticsLineChart from './SrsNationalStatisticsLineChart'

export const SRS_STATISTICS_TITLE = 'Andel avslutade sjukskrivningsfall*'
export const SRS_STATISTICS_INFO = '*Sjukskrivningsfall som påbörjades 2017 (Källa: Försäkringskassan)'

const SrsNationalStatistics = () => {
  const diagnosisCode = useAppSelector(getDiagnosisCode(SrsInformationChoice.STATISTICS))
  const diagnosisDescription = useAppSelector(getDiagnosisDescription(SrsInformationChoice.STATISTICS))
  const infoTooltip = `Den statistik som visas är för koden ${diagnosisCode} - ${diagnosisDescription}.`

  return (
    <>
      <h3>
        {SRS_STATISTICS_TITLE} {diagnosisCode}
      </h3>
      <p className="iu-fw-bold iu-mb-200">
        {diagnosisDescription} <InfoCircle className="iu-ml-200" tooltip={infoTooltip} />
      </p>
      <SrsNationalStatisticsLineChart />
      <p>{SRS_STATISTICS_INFO}</p>
    </>
  )
}

export default SrsNationalStatistics
