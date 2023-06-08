import { FMBDiagnosisCodeInfo, InfoCircle, RadioButton } from '@frontend/common'
import React, { ChangeEvent, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

interface Props {
  fmbDiagnosisCodes: FMBDiagnosisCodeInfo[]
  selectedDiagnosisCode?: FMBDiagnosisCodeInfo
  onDiagnosisSelect: (icd10Code: string) => void
}

const FMBPanelDiagnoses: React.FC<Props> = ({ fmbDiagnosisCodes, selectedDiagnosisCode, onDiagnosisSelect }) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDiagnosisSelect(event.target.value)
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <div className="iu-border-grey-300 iu-p-500 iu-m-none">
      <div role="group" aria-label="Diagnosis selection" className="ic-checkbox-group-vertical">
        {fmbDiagnosisCodes.map((diagnosisCode: FMBDiagnosisCodeInfo) => (
          <RadioButton
            key={diagnosisCode.originalIcd10Code}
            label={diagnosisCode.originalIcd10Description ?? ''}
            value={diagnosisCode.originalIcd10Code}
            checked={diagnosisCode.originalIcd10Code === selectedDiagnosisCode?.originalIcd10Code && !!diagnosisCode.diagnosTitle}
            id={diagnosisCode.originalIcd10Code}
            name={diagnosisCode.originalIcd10Code}
            disabled={!diagnosisCode.diagnosTitle}
            onChange={onChange}
            wrapperAdditionalStyles={'iu-mb-200'}
            tooltip={!diagnosisCode.diagnosTitle ? 'Det finns inget FMB-stöd för den angivna diagnosen.' : ''}
            tooltipPlacement="left">
            {diagnosisCode.icd10Code && diagnosisCode.icd10Code !== diagnosisCode.originalIcd10Code && (
              <InfoCircle
                testId={'fmbInfoCircle'}
                className="iu-ml-200 iu-mb-200"
                tooltip={'Det FMB-stöd som visas är för koden ' + diagnosisCode.icd10Code + ' - ' + diagnosisCode.icd10Description + '.'}
              />
            )}
          </RadioButton>
        ))}
      </div>
    </div>
  )
}

export default FMBPanelDiagnoses
