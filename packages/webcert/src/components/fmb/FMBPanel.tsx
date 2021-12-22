import React, { useState } from 'react'
import FMBPanelFooter from './FMBPanelFooter'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import FMBPanelDiagnoses from './FMBPanelDiagnoses'
import noDiagnosisIcon from './fmb_no_diagnosis.svg'
import { FMBDiagnosisCodeInfo, ImageCentered } from '@frontend/common'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'
import _ from 'lodash'
import styled from 'styled-components/macro'

export const Italic = styled.p`
  font-style: italic;
`

const FMBPanel: React.FC = () => {
  const fmbDiagnosisCodes = useSelector(getFMBDiagnosisCodes, _.isEqual)
  const [selectedDiagnosisCode, setSelectedDiagnosisCode] = useState<FMBDiagnosisCodeInfo>()

  const onDiagnosisSelect = (icd10Code: string) => {
    const fmbDiagnoseCode = fmbDiagnosisCodes.find((value) => value.originalIcd10Code === icd10Code)
    if (fmbDiagnoseCode) {
      setSelectedDiagnosisCode(fmbDiagnoseCode)
    }
  }

  const isEmpty = (): boolean => fmbDiagnosisCodes.length === 0

  const isNoDiagnosesSelected = (): boolean =>
    fmbDiagnosisCodes.find((value) => value === selectedDiagnosisCode && value.diagnosTitle) === undefined

  const selectDefaultDiagnosis = () => {
    const fmbDiagnoseCode = fmbDiagnosisCodes.reduce((previousValue, currentValue) => {
      if (!previousValue.diagnosTitle && currentValue.diagnosTitle) {
        return currentValue
      }

      return previousValue
    })
    if (fmbDiagnoseCode !== selectedDiagnosisCode) {
      setSelectedDiagnosisCode(fmbDiagnoseCode)
    }
  }

  const hasSeveralDiagnoses = (): boolean => {
    return fmbDiagnosisCodes.length > 1
  }

  if (!isEmpty() && isNoDiagnosesSelected()) {
    selectDefaultDiagnosis()
  }

  return (
    <>
      <PanelHeader description="Diagnosspecifik information" />
      {isEmpty() ? (
        <ImageCentered imgSrc={noDiagnosisIcon} alt={'Ingen diagnos vald'}>
          <p>Ange minst en diagnos för att få FMB-stöd.</p>
        </ImageCentered>
      ) : (
        <>
          <FMBPanelDiagnoses
            fmbDiagnosisCodes={fmbDiagnosisCodes}
            selectedDiagnosisCode={selectedDiagnosisCode}
            onDiagnosisSelect={onDiagnosisSelect}
          />
          {selectedDiagnosisCode && (
            <FMBPanelDiagnosisInfo fmbDiagnosisCodeInfo={selectedDiagnosisCode} hasSeveralDiagnoses={hasSeveralDiagnoses()} />
          )}
        </>
      )}
      <FMBPanelFooter />
    </>
  )
}

export default FMBPanel
