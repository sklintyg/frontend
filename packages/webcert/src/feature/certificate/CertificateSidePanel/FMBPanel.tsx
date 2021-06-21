import React, { ChangeEvent, ReactNode, useState } from 'react'
import FMBPanelFooter from './FMBPanelFooter'
import PanelHeader from './PanelHeader'
import noDiagnosisIcon from './fmb_no_diagnosis.svg'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../../store/fmb/fmbSelectors'
import { FMBDiagnosisCodeInfo, RadioButton } from '@frontend/common'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'
import styled from 'styled-components'

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const FMBPanel: React.FC<Props> = ({ minimizeSidePanel }) => {
  const fmbDiagnosisCodes = useSelector(getFMBDiagnosisCodes)
  const [selectedDiagnosisIndex, setSelectedDiagnosisIndex] = useState(0)

  const onDiagnosisSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDiagnosisIndex(parseInt(event.target.value))
  }

  return (
    <>
      <Root className="iu-border-grey-300">
        <PanelHeader description="Diagnosspecifik information" minimizeSidePanel={minimizeSidePanel} />
        {fmbDiagnosisCodes.length === 0 ? (
          <EmptyWrapper>
            <img alt="" src={noDiagnosisIcon} />
            <div>Ange minst en diagnos för att få FMB-stöd.</div>
          </EmptyWrapper>
        ) : (
          <>
            <div className="iu-border-grey-300 iu-p-500">
              <div role="group" aria-label="Diagnosis selection" className="ic-checkbox-group-horizontal">
                {fmbDiagnosisCodes.map((diagnosisCode: FMBDiagnosisCodeInfo, index: number) => (
                  <RadioButton
                    key={diagnosisCode.icd10Code}
                    label={diagnosisCode.icd10Description}
                    value={index}
                    checked={index === selectedDiagnosisIndex}
                    id={diagnosisCode.icd10Code}
                    name={diagnosisCode.icd10Code}
                    onChange={onDiagnosisSelect}
                  />
                ))}
              </div>
            </div>
            <FMBPanelDiagnosisInfo diagnosisCodes={fmbDiagnosisCodes} selectedDiagnosisIndex={selectedDiagnosisIndex} />
          </>
        )}
        <FMBPanelFooter />
      </Root>
    </>
  )
}

export default FMBPanel
