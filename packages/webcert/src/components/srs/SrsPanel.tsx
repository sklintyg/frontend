import React, { useEffect, useState } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import SrsPanelError from './SrsPanelError'
import SrsPanelNoSupportInfo from './SrsPanelNoSupportInfo'
import SrsPanelEmptyInfo from './SrsPanelEmptyInfo'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateId, getDiagnosisCodes, getDiagnosisListValue, getHasError, getPatientId } from '../../store/srs/srsSelectors'
import SRSPanelFooter from './SrsPanelFooter'
import { getRecommendations, getSRSCodes } from '../../store/srs/srsActions'
import SRSSickleaveChoices from './SrsSickLeaveChoices'
import SrsInformationChoices from './SrsInformationChoices'
import { SrsInformationChoice } from '@frontend/common'
import SrsRecommendations from './SrsRecommendations'
import SrsNationalStatistics from './SrsNationalStatistics'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

export const SRS_TITLE = 'Risk för sjukskrivning längre än 90 dagar'

const Wrapper = styled.div`
  overflow-y: auto;
`

const SrsPanel: React.FC = () => {
  const dispatch = useDispatch()
  const diagnosisListValue = useSelector(getDiagnosisListValue)
  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const diagnosisCodes = useSelector(getDiagnosisCodes)
  const hasError = useSelector(getHasError)
  const [informationChoice, setInformationChoice] = useState(SrsInformationChoice.RECOMMENDATIONS)
  const mainDiagnosis = diagnosisListValue ? diagnosisListValue?.list.find((diagnosis) => diagnosis.id.includes('0')) : undefined
  const isEmpty = !mainDiagnosis
  const supportedDiagnosisCode = diagnosisCodes.find((code) => mainDiagnosis && mainDiagnosis.code === code) ?? ''
  const hasSupportedDiagnosisCode = supportedDiagnosisCode.length > 0

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    if (!isEmpty && diagnosisCodes.length == 0) {
      dispatch(getSRSCodes())
    }
  }, [isEmpty, diagnosisCodes, dispatch])

  useEffect(() => {
    if (supportedDiagnosisCode) {
      dispatch(getRecommendations({ patientId: patientId, code: supportedDiagnosisCode, certificateId: certificateId }))
    }
  }, [supportedDiagnosisCode, certificateId, patientId, dispatch])

  const getContent = () => {
    if (hasError) {
      return <SrsPanelError />
    }

    if (isEmpty) {
      return <SrsPanelEmptyInfo />
    }

    if (!hasSupportedDiagnosisCode) {
      return <SrsPanelNoSupportInfo />
    }

    return (
      <>
        <p className="iu-fw-bold">Riskberäkningen gäller:</p>
        <SRSSickleaveChoices />
        <SrsInformationChoices onChange={setInformationChoice} currentChoice={informationChoice} />
        {informationChoice === SrsInformationChoice.RECOMMENDATIONS ? <SrsRecommendations /> : <SrsNationalStatistics />}
      </>
    )
  }

  return (
    <>
      <PanelHeader description={SRS_TITLE} />
      <Wrapper className="iu-border-grey-300 iu-p-500 iu-m-none">{getContent()}</Wrapper>
      {hasSupportedDiagnosisCode && <SRSPanelFooter informationChoice={informationChoice} />}
    </>
  )
}

export default SrsPanel
