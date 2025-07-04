import { isEqual } from 'lodash-es'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import { initializeFMBPanel } from '../../store/fmb/fmbActions'
import { getDiagnosisListValue, getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import { useAppDispatch, useAppSelector } from '../../store/store'
import type { FMBDiagnosisCodeInfo } from '../../types'
import ImageCentered from '../image/image/ImageCentered'
import FMBPanelDiagnoses from './FMBPanelDiagnoses'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'
import FMBPanelFooter from './FMBPanelFooter'
import noDiagnosisIcon from './fmb_no_diagnosis.svg'

export const Italic = styled.p`
  font-style: italic;
`

const FMBPanel = () => {
  const dispatch = useAppDispatch()
  const fmbDiagnosisCodes = useAppSelector(getFMBDiagnosisCodes, isEqual)
  const [selectedDiagnosisCode, setSelectedDiagnosisCode] = useState<FMBDiagnosisCodeInfo>()
  const diagnosisValue = useAppSelector(getDiagnosisListValue, isEqual)
  const isIcd10Chosen =
    !diagnosisValue || diagnosisValue.list.length === 0 || diagnosisValue.list[0]?.terminology.toLowerCase().includes('icd')

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

  useEffect(() => {
    dispatch(initializeFMBPanel())
  })

  return !isIcd10Chosen ? (
    <ImageCentered imgSrc={noDiagnosisIcon} alt={'Inget FMB-stöd'}>
      <p>FMB-stödet finns enbart för koder som ingår i ICD-10-SE.</p>
    </ImageCentered>
  ) : (
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
