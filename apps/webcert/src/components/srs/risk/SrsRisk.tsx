import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from '../../../images'
import { getPredictions, logSrsInteraction, updateSrsAnswers } from '../../../store/srs/srsActions'
import {
  getCertificateId,
  getDiagnosisListValue,
  getPatientId,
  getPreviousAnswers,
  getSickLeaveChoice,
} from '../../../store/srs/srsSelectors'
import { SrsAnswer, SrsEvent, SrsSickLeaveChoice } from '../../../types'
import { getMainDiagnosisCode } from '../srsUtils'
import SrsRiskForm from './SrsRiskForm'
import SrsRiskGraph from './SrsRiskGraph'
import SrsRiskOpinion from './SrsRiskOpinion'

interface StyledButtonProps {
  disabled: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
  font-size: 1.375em;
  font-family: inherit;
  width: calc(100% + 40px);
  padding: 1rem;
  margin: 20px 0 20px -40px;
  left: 20px;
  position: relative;
  border: none;
  color: inherit;
  font-weight: 700;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  text-align: left;
  cursor: ${(props) => props.disabled && 'not-allowed'} !important;
`

const BottomBorder = styled.div`
  height: 20px;
  margin: 20px -20px;
`

export const SRS_RISK_BUTTON_TEXT = 'Beräkna risk här'

const SrsRisk: React.FC = () => {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<null | HTMLDivElement>(null)

  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const valueDiagnosis = useSelector(getDiagnosisListValue)
  const previousAnswers = useSelector(getPreviousAnswers)
  const isCalculatingRiskDisabled = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  const getIcon = () => {
    return expanded ? (
      <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto', marginBottom: '4px' }} data-testid="chevron-up" />
    ) : (
      <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} data-testid="chevron-down" />
    )
  }

  useEffect(() => {
    if (isCalculatingRiskDisabled) {
      setExpanded(false)
    }
  }, [isCalculatingRiskDisabled])

  const onButtonClicked = () => {
    dispatch(logSrsInteraction(SrsEvent.SRS_PANEL_ACTIVATED))
    if (expanded) {
      dispatch(logSrsInteraction(SrsEvent.SRS_HIDE_QUESTIONS_CLICKED))
    } else {
      dispatch(logSrsInteraction(SrsEvent.SRS_SHOW_QUESTIONS_CLICKED))
    }

    setExpanded(!expanded)
  }

  const onCalculateRisk = (answers: SrsAnswer[]) => {
    dispatch(
      getPredictions({
        patientId: patientId,
        certificateId: certificateId,
        code: getMainDiagnosisCode(valueDiagnosis),
        answers: answers,
        daysIntoSickLeave: sickLeaveChoice === SrsSickLeaveChoice.EXTENSION ? 45 : undefined,
      })
    )

    dispatch(updateSrsAnswers(answers))
    dispatch(logSrsInteraction(SrsEvent.SRS_CALCULATE_CLICKED))
    setExpanded(false)

    if (ref.current) {
      ref.current.scrollIntoView()
    }
  }

  return (
    <div ref={ref}>
      <SrsRiskGraph ref={ref} />
      <SrsRiskOpinion />
      <StyledButton
        className={`${isCalculatingRiskDisabled ? 'iu-bg-grey-200 disabled' : 'iu-bg-information-light'}`}
        onClick={onButtonClicked}
        disabled={isCalculatingRiskDisabled}
      >
        {SRS_RISK_BUTTON_TEXT} {getIcon()}
      </StyledButton>
      {expanded && (
        <>
          <SrsRiskForm previousAnswers={previousAnswers} onClick={onCalculateRisk} />
          <BottomBorder className="iu-bg-information-light" />
        </>
      )}
    </div>
  )
}

export default SrsRisk
