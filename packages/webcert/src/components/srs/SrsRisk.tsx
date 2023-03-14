import React, { useState } from 'react'
import SrsRiskForm from './SrsRiskForm'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, SrsSickLeaveChoice } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getSickLeaveChoice } from '../../store/srs/srsSelectors'
import SrsRiskGraph from './SrsRiskGraph'
import SrsRiskOpinion from './SrsRiskOpinion'

const StyledButton = styled.button`
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
`

const BottomBorder = styled.div`
  height: 20px;
  margin: 20px -20px;
`

const SrsRisk: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const isCalculatingRiskDisabled = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  const getIcon = () => {
    return expanded ? (
      <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto', marginBottom: '4px' }} />
    ) : (
      <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
    )
  }

  return (
    <>
      <SrsRiskGraph />
      <SrsRiskOpinion />
      <StyledButton
        className={`${isCalculatingRiskDisabled ? 'iu-bg-grey-200' : 'iu-bg-information-light'}`}
        onClick={() => setExpanded(!expanded)}
        disabled={isCalculatingRiskDisabled}>
        Beräkna risk här {getIcon()}
      </StyledButton>
      {expanded && (
        <>
          <SrsRiskForm />
          <BottomBorder className="iu-bg-information-light" />
        </>
      )}
    </>
  )
}

export default SrsRisk
