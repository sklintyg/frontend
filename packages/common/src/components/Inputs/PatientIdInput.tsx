import React, { ChangeEvent, useState } from 'react'
import { TextInput } from '../index'
import { css } from 'styled-components/macro'
import InvalidPersonIdMessage from '../Validation/InvalidPersonIdMessage'
import { isPersonIdValid } from '../../utils/personIdValidatorUtils'

interface Props {
  label?: string
  onFormattedChange: (id: string) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  value: string
  id?: string
}

const TextInputStyles = css`
  width: 10.05em;
  margin-right: 0.5em;
`

const PersonIdInput: React.FC<Props> = ({ label, onFormattedChange, value, id }) => {
  const [displayError, setDisplayError] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFormattedChange(formatPersonId(event.currentTarget.value))
  }

  const formatPersonId = (id: string) => {
    let cleanId = id.replace(/\D/g, '')
    if (cleanId.length > 8) {
      cleanId = cleanId.slice(0, 8) + '-' + cleanId.slice(8, cleanId.length)
    }
    return cleanId
  }

  return (
    <>
      <TextInput
        id={id}
        label={label}
        onChange={onChange}
        placeholder="ååååmmdd-nnnn"
        value={value}
        limit={13}
        onBlur={() => {
          setDisplayError(value !== '' && !isPersonIdValid(value))
        }}
        onFocus={() => setDisplayError(false)}
        additionalStyles={TextInputStyles}
        hasValidationError={displayError}
      />
      <InvalidPersonIdMessage display={displayError} />
    </>
  )
}

export default PersonIdInput
