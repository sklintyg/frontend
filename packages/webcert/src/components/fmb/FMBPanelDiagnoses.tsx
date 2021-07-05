import React, { ChangeEvent } from 'react'
import { ButtonTooltip, FMBDiagnosisCodeInfo, RadioButton } from '@frontend/common'

interface Props {
  fmbDiagnosisCodes: FMBDiagnosisCodeInfo[]
  selectedDiagnosisCode?: FMBDiagnosisCodeInfo
  onDiagnosisSelect: (icd10Code: string) => void
}

const FMBPanelDiagnoses: React.FC<Props> = ({ fmbDiagnosisCodes, selectedDiagnosisCode, onDiagnosisSelect }) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDiagnosisSelect(event.target.value)
  }

  return (
    <div className="iu-border-grey-300 iu-p-500 iu-m-none">
      <div role="group" aria-label="Diagnosis selection" className="ic-checkbox-group-vertical">
        {fmbDiagnosisCodes.map((diagnosisCode: FMBDiagnosisCodeInfo) => (
          <ButtonTooltip
            key={diagnosisCode.icd10Code}
            description={!diagnosisCode.diagnosTitle ? 'För den angivna diagnosen finns för tillfället inget FMB-stöd.' : ''}>
            <RadioButton
              key={diagnosisCode.icd10Code}
              label={diagnosisCode.icd10Description}
              value={diagnosisCode.icd10Code}
              checked={diagnosisCode.icd10Code === selectedDiagnosisCode?.icd10Code}
              id={diagnosisCode.icd10Code}
              name={diagnosisCode.icd10Code}
              disabled={!diagnosisCode.diagnosTitle}
              onChange={onChange}
            />
          </ButtonTooltip>
        ))}
      </div>
    </div>
  )
}

export default FMBPanelDiagnoses
