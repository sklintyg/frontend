import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PanelHeader from '../../../feature/certificate/CertificateSidePanel/PanelHeader'
import { getQuestions, getRecommendations, getSRSCodes, logSrsInteraction } from '../../../store/srs/srsActions'
import {
  getCertificateId,
  getDiagnosisCode,
  getDiagnosisCodes,
  getDiagnosisListValue,
  getHasError,
  getLoading,
  getPatientId,
  hasLoggedMeasuresDisplayed,
} from '../../../store/srs/srsSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { SrsEvent, SrsInformationChoice } from '../../../types'
import Spinner from '../../utils/Spinner'
import SrsInformationChoices from '../choices/SrsInformationChoices'
import SRSSickleaveChoices from '../choices/SrsSickLeaveChoices'
import { SrsMinimizedView } from '../minimizedView/SrsMinimizedView'
import SrsRecommendations from '../recommendations/SrsRecommendations'
import SrsRisk from '../risk/SrsRisk'
import { isScrolledIntoView } from '../srsUtils'
import SrsNationalStatistics from '../statistics/SrsNationalStatistics'
import SrsPanelEmptyInfo from './SrsPanelEmptyInfo'
import SrsPanelError from './SrsPanelError'
import SRSPanelFooter from './SrsPanelFooter'
import SrsPanelNoSupportInfo from './SrsPanelNoSupportInfo'

export const SRS_TITLE = 'Risk för sjukskrivning längre än 90 dagar'

const Wrapper = styled.div`
  overflow-y: auto;
`

interface Props {
  minimizedView?: boolean
  isPanelActive: boolean
}

const SrsPanel = ({ minimizedView, isPanelActive }: Props) => {
  const dispatch = useAppDispatch()
  const diagnosisListValue = useAppSelector(getDiagnosisListValue)
  const patientId = useAppSelector(getPatientId)
  const certificateId = useAppSelector(getCertificateId)
  const diagnosisCodes = useAppSelector(getDiagnosisCodes)
  const hasError = useAppSelector(getHasError)
  const isLoading = useAppSelector(getLoading)
  const diagnosisCodeForPredictions = useAppSelector(getDiagnosisCode(SrsInformationChoice.RECOMMENDATIONS))
  const hasLoggedMeasuresDisplay = useAppSelector(hasLoggedMeasuresDisplayed)

  const [informationChoice, setInformationChoice] = useState(SrsInformationChoice.RECOMMENDATIONS)
  const mainDiagnosis = diagnosisListValue ? diagnosisListValue?.list.find((diagnosis) => diagnosis.id.includes('0')) : undefined
  const isEmpty = !mainDiagnosis || mainDiagnosis.code.length == 0
  const supportedDiagnosisCode =
    diagnosisCodes.find((code) => mainDiagnosis && (mainDiagnosis.code === code || mainDiagnosis.code.substring(0, 3) === code)) ?? ''
  const hasSupportedDiagnosisCode = supportedDiagnosisCode.length > 0

  const ref = useRef<HTMLDivElement>(null)
  const measuresRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const logMeasuresDisplayed = useCallback(() => {
    if (measuresRef && measuresRef.current && footerRef && footerRef.current) {
      const isMeasuresVisible = isScrolledIntoView(measuresRef.current, true, footerRef.current.clientHeight)
      if (isMeasuresVisible) {
        dispatch(logSrsInteraction(SrsEvent.SRS_MEASURES_DISPLAYED))
      }
    }
  }, [dispatch])

  const handleScroll = useCallback(() => {
    if (isPanelActive) {
      dispatch(logSrsInteraction(SrsEvent.SRS_PANEL_ACTIVATED))
      if (!hasLoggedMeasuresDisplay) {
        logMeasuresDisplayed()
      }
    }
  }, [isPanelActive, dispatch, hasLoggedMeasuresDisplay, logMeasuresDisplayed])

  useEffect(() => {
    const currentRef = ref.current
    currentRef?.addEventListener('scroll', handleScroll)
    return () => {
      currentRef?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, ref, dispatch, logMeasuresDisplayed, hasLoggedMeasuresDisplay])

  useEffect(() => {
    if (isPanelActive && !isEmpty && diagnosisCodes.length == 0) {
      dispatch(getSRSCodes())
    }
  }, [isEmpty, diagnosisCodes, dispatch, isPanelActive])

  useEffect(() => {
    if (isPanelActive && supportedDiagnosisCode && mainDiagnosis && mainDiagnosis.code !== diagnosisCodeForPredictions) {
      dispatch(getRecommendations({ patientId: patientId, code: mainDiagnosis.code, certificateId: certificateId }))
      dispatch(getQuestions(mainDiagnosis.code))
    }
  }, [diagnosisCodeForPredictions, supportedDiagnosisCode, certificateId, patientId, dispatch, mainDiagnosis, isPanelActive])

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

    if (minimizedView) {
      return <SrsMinimizedView ref={measuresRef} />
    }

    return (
      <>
        <p className="iu-fw-bold">Riskberäkningen gäller:</p>
        <SRSSickleaveChoices />
        <SrsRisk />
        <SrsInformationChoices onChange={updateInformationChoice} currentChoice={informationChoice} />
        {informationChoice === SrsInformationChoice.RECOMMENDATIONS ? <SrsRecommendations ref={measuresRef} /> : <SrsNationalStatistics />}
      </>
    )
  }

  return (
    <>
      <PanelHeader description={SRS_TITLE} />
      <Wrapper ref={ref} className="iu-border-grey-300 iu-p-500 iu-m-none">
        {getContent()}
      </Wrapper>
      {hasSupportedDiagnosisCode && <SRSPanelFooter ref={footerRef} informationChoice={informationChoice} />}
    </>
  )
}

export default SrsPanel
