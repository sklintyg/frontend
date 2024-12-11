import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import Checkbox from '../../../../components/Inputs/Checkbox'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import type { ConfigEyeAcuity, ValidationError, ValueEyeAcuity } from '../../../../types'
import { formatAcuity } from '../../../../utils/format/formatAcuity'

const AcuityInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

const parseValue = (val: string): number | null => {
  const num = parseFloat(val.replace(/,/gm, '.'))
  return isNaN(num) ? null : num
}

const formatFixed = (value: string) => {
  return value ? parseFloat(value.replace(',', '.')).toFixed(1).replace('.', ',') : ''
}

export interface Props {
  disabled?: boolean
  config: ConfigEyeAcuity
  value: ValueEyeAcuity
  validationErrors: ValidationError[]
  onChange: (value: ValueEyeAcuity) => void
}

const UeEyeAcuity: React.FC<Props> = ({ disabled, config, value, onChange, validationErrors }) => {
  const [noCorrection, setNoCorrection] = useState(formatFixed(value.withoutCorrection.value?.toString() ?? ''))
  const [correction, setCorrection] = useState(formatFixed(value.withCorrection.value?.toString() ?? ''))
  const [contacts, setContacts] = useState(value?.contactLenses?.selected === true)

  const onNoCorrectionChange = (noCorrectionValue: string) => {
    noCorrectionValue = formatAcuity(noCorrectionValue)
    setNoCorrection(noCorrectionValue)
    const result = parseValue(noCorrectionValue)
    onChange({ ...value, withoutCorrection: { ...value.withoutCorrection, value: result } })
  }

  const onCorrectionChange = (correctionValue: string) => {
    correctionValue = formatAcuity(correctionValue)
    setCorrection(correctionValue)
    const result = parseValue(correctionValue)
    onChange({ ...value, withCorrection: { ...value.withCorrection, value: result } })
  }

  const onContactsChange = (selected: boolean) => {
    setContacts(selected)
    if (value.contactLenses) {
      onChange({ ...value, contactLenses: { ...value.contactLenses, selected } })
    }
  }

  return (
    <>
      <div className="iu-grid-span-3">{config.label}</div>
      <div className="iu-grid-span-3">
        <AcuityInput
          disabled={disabled}
          id={config.withoutCorrectionId}
          data-testid={config.withoutCorrectionId}
          value={noCorrection}
          limit={3}
          onChange={(event) => {
            onNoCorrectionChange(event.currentTarget.value)
          }}
          hasValidationError={validationErrors.some(({ field }) => field === config.withoutCorrectionId)}
          onBlur={() => setNoCorrection(formatFixed(noCorrection))}
        ></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
        <AcuityInput
          disabled={disabled}
          id={config.withCorrectionId}
          data-testid={config.withCorrectionId}
          value={correction}
          limit={3}
          onChange={(event) => {
            onCorrectionChange(event.currentTarget.value)
          }}
          hasValidationError={validationErrors.some(({ field }) => field === config.withCorrectionId)}
          onBlur={() => setCorrection(formatFixed(correction))}
        ></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
        {config.contactLensesId && (
          <Checkbox
            disabled={disabled}
            id={config.contactLensesId}
            onChange={(event) => {
              onContactsChange(event.currentTarget.checked)
            }}
            hasValidationError={validationErrors.some(({ field }) => field && field === config.contactLensesId)}
            checked={contacts}
          ></Checkbox>
        )}
      </div>
      {validationErrors.length > 0 && (
        <div className="iu-grid-span-12">
          {' '}
          <QuestionValidationTexts validationErrors={validationErrors} />
        </div>
      )}
    </>
  )
}

export default UeEyeAcuity
