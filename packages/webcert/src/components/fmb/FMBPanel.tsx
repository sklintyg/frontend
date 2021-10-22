import React, { ReactNode, useState } from 'react'
import FMBPanelFooter from './FMBPanelFooter'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import FMBPanelDiagnoses from './FMBPanelDiagnoses'
import noDiagnosisIcon from './fmb_no_diagnosis.svg'
import { FMBDiagnosisCodeInfo, ImageCentered } from '@frontend/common'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'

const FMBPanel: React.FC = () => {
  const fmbDiagnosisCodes = useSelector(getFMBDiagnosisCodes)
  const [selectedDiagnosisCode, setSelectedDiagnosisCode] = useState<FMBDiagnosisCodeInfo>()

  const onDiagnosisSelect = (icd10Code: string) => {
    const fmbDiagnoseCode = fmbDiagnosisCodes.find((value) => value.icd10Code === icd10Code)
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
          {selectedDiagnosisCode && <FMBPanelDiagnosisInfo fmbDiagnosisCodeInfo={selectedDiagnosisCode} />}
        </>
      )}
      <FMBPanelFooter />
    </>
  )
}

export default FMBPanel
