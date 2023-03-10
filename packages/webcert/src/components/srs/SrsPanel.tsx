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
  overflow: auto;
`

const SrsPanel: React.FC = () => {
  const dispatch = useDispatch()
  const diagnosisListValue = useSelector(getDiagnosisListValue)
  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const diagnosisCodes = useSelector(getDiagnosisCodes)
  const hasError = useSelector(getHasError)
  const [informationChoice, setInformationChoice] = useState(SrsInformationChoice.RECOMMENDATIONS)

  const isEmpty = !diagnosisListValue || diagnosisListValue.list.length == 0
  const isDiagnosisDefined = diagnosisListValue && diagnosisListValue.list && diagnosisListValue.list.length > 0
  const supportedDiagnosisCode = diagnosisCodes.find((code) => isDiagnosisDefined && diagnosisListValue?.list[0].code === code) ?? ''
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

  const updateInformationChoice = (choice: SrsInformationChoice) => {
    setInformationChoice(choice)
  }

  const getMainContent = () => {
    return informationChoice === SrsInformationChoice.RECOMMENDATIONS ? <SrsRecommendations /> : <SrsNationalStatistics />
  }

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
      <Wrapper>
        <p className="iu-fw-bold">Riskberäkningen gäller:</p>
        <SRSSickleaveChoices />
        <SrsInformationChoices onChange={updateInformationChoice} currentChoice={informationChoice} />
        {getMainContent()}
      </Wrapper>
    )
  }

  return (
    <>
      <PanelHeader description={SRS_TITLE} />
      <div className="iu-border-grey-300 iu-p-500 iu-m-none">{getContent()}</div>
      {hasSupportedDiagnosisCode && <SRSPanelFooter informationChoice={informationChoice} />}
    </>
  )
}

export default SrsPanel
