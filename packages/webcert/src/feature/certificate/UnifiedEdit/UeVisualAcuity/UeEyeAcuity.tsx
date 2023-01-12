import {
  Checkbox,
  ConfigEyeAcuity,
  formatAcuity,
  QuestionValidationTexts,
  TextInput,
  ValueEyeAcuity,
  ValidationError,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

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

export interface Props {
  questionId: string
  disabled?: boolean
  config: ConfigEyeAcuity
  value: ValueEyeAcuity
  validationErrors: ValidationError[]
  onChange: (value: ValueEyeAcuity) => void
}

const UeEyeAcuity: React.FC<Props> = ({ questionId, disabled, config, value, onChange, validationErrors }) => {
  const [noCorrection, setNoCorrection] = useState(formatAcuity(value.withoutCorrection.value?.toString() ?? ''))
  const [correction, setCorrection] = useState(formatAcuity(value.withCorrection.value?.toString() ?? ''))
  const [contacts, setContacts] = useState(value?.contactLenses?.selected === true)

  const noCorrectionValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.withoutCorrectionId)).length > 0
  const correctionValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.withCorrectionId)).length > 0
  const contactsValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.contactLensesId)).length > 0

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
          value={noCorrection}
          limit={3}
          onChange={(event) => {
            onNoCorrectionChange(event.currentTarget.value)
          }}
          hasValidationError={noCorrectionValidationErrors}
          onBlur={() => setNoCorrection(formatAcuity(noCorrection))}></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
        <AcuityInput
          disabled={disabled}
          id={config.withCorrectionId}
          value={correction}
          limit={3}
          onChange={(event) => {
            onCorrectionChange(event.currentTarget.value)
          }}
          hasValidationError={correctionValidationErrors}
          onBlur={() => setCorrection(formatAcuity(correction))}></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
        {config.contactLensesId && (
          <Checkbox
            disabled={disabled}
            id={config.contactLensesId}
            onChange={(event) => {
              onContactsChange(event.currentTarget.checked)
            }}
            hasValidationError={contactsValidationErrors}
            checked={contacts}></Checkbox>
        )}
      </div>
      {(noCorrectionValidationErrors || correctionValidationErrors || (config.contactLensesId && contactsValidationErrors)) && (
        <div className="iu-grid-span-12">
          {' '}
          <QuestionValidationTexts validationErrors={validationErrors} />
        </div>
      )}
    </>
  )
}

export default UeEyeAcuity
