import React, { useEffect, useState } from 'react'
import PanelHeader from '../../../feature/certificate/CertificateSidePanel/PanelHeader'
import SrsPanelError from './SrsPanelError'
import SrsPanelNoSupportInfo from './SrsPanelNoSupportInfo'
import SrsPanelEmptyInfo from './SrsPanelEmptyInfo'
import { useDispatch, useSelector } from 'react-redux'
import {
  getCertificateId,
  getDiagnosisCodes,
  getDiagnosisListValue,
  getHasError,
  getLoading,
  getPatientId,
} from '../../../store/srs/srsSelectors'
import SRSPanelFooter from './SrsPanelFooter'
import { getQuestions, getRecommendations, getSRSCodes, logSrsInteraction } from '../../../store/srs/srsActions'
import SRSSickleaveChoices from '../choices/SrsSickLeaveChoices'
import SrsInformationChoices from '../choices/SrsInformationChoices'
import { Spinner, SrsEvent, SrsInformationChoice } from '@frontend/common'
import SrsRecommendations from '../recommendations/SrsRecommendations'
import SrsNationalStatistics from '../statistics/SrsNationalStatistics'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import SrsRisk from '../risk/SrsRisk'

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
  const isLoading = useSelector(getLoading)

  const [informationChoice, setInformationChoice] = useState(SrsInformationChoice.RECOMMENDATIONS)
  const mainDiagnosis = diagnosisListValue ? diagnosisListValue?.list.find((diagnosis) => diagnosis.id.includes('0')) : undefined
  const isEmpty = !mainDiagnosis || mainDiagnosis.code.length == 0
  const supportedDiagnosisCode =
    diagnosisCodes.find((code) => mainDiagnosis && (mainDiagnosis.code === code || mainDiagnosis.code.substring(0, 3) === code)) ?? ''
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
    if (supportedDiagnosisCode && mainDiagnosis) {
      dispatch(getRecommendations({ patientId: patientId, code: mainDiagnosis.code, certificateId: certificateId }))
      dispatch(getQuestions(mainDiagnosis.code))
    }
  }, [supportedDiagnosisCode, certificateId, patientId, dispatch, mainDiagnosis])

  const updateInformationChoice = (choice: SrsInformationChoice) => {
    setInformationChoice(choice)
    if (choice === SrsInformationChoice.STATISTICS) {
      dispatch(logSrsInteraction(SrsEvent.SRS_STATISTICS_ACTIVATED))
    }
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner />
    }

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
        <SrsRisk />
        <SrsInformationChoices onChange={updateInformationChoice} currentChoice={informationChoice} />
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
