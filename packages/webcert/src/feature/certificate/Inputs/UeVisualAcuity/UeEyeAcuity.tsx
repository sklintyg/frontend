import { Checkbox, ConfigEyeAcuity, QuestionValidationTexts, TextInput, ValueEyeAcuity } from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { parseAcuity } from './parseAcuity'

const parseFixed = (value: string) => {
  return value
    ? parseFloat(value.replace(',', '.'))
        .toFixed(1)
        .replace('.', ',')
    : ''
}

const AcuityInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

export interface Props {
  questionId: string
  disabled?: boolean
  config: ConfigEyeAcuity
  value: ValueEyeAcuity
  onChange: (value: ValueEyeAcuity) => void
}

const UeEyeAcuity: React.FC<Props> = ({ questionId, disabled, config, value, onChange }) => {
  const [noCorrection, setNoCorrection] = useState(parseFixed(value.withoutCorrection.value?.toString() ?? ''))
  const [correction, setCorrection] = useState(parseFixed(value.withCorrection.value?.toString() ?? ''))
  const [contacts, setContacts] = useState(value?.contactLenses?.selected === true)

  const validationErrors = useSelector(getVisibleValidationErrors(questionId))

  const noCorrectionValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.withoutCorrectionId)).length > 0
  const correctionValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.withCorrectionId)).length > 0
  const contactsValidationErrors = useSelector(getVisibleValidationErrors(questionId, config.contactLensesId)).length > 0

  const onNoCorrectionChange = (noCorrectionValue: string) => {
    noCorrectionValue = parseAcuity(noCorrectionValue)
    setNoCorrection(noCorrectionValue)
    if (parseFloat(noCorrectionValue) || !noCorrectionValue) {
      onChange({ ...value, withoutCorrection: { ...value.withoutCorrection, value: parseFloat(noCorrectionValue.replace(/,/gm, '.')) } })
    }
  }

  const onCorrectionChange = (correctionValue: string) => {
    correctionValue = parseAcuity(correctionValue)
    setCorrection(correctionValue)
    if (parseFloat(correctionValue) || !correctionValue) {
      onChange({ ...value, withCorrection: { ...value.withCorrection, value: parseFloat(correctionValue.replace(/,/gm, '.')) } })
    }
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
          onBlur={() => setNoCorrection(parseFixed(noCorrection))}></AcuityInput>
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
          onBlur={() => setCorrection(parseFixed(correction))}></AcuityInput>
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
