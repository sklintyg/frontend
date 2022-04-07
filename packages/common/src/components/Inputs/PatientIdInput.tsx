import React, { ChangeEvent, useEffect, useState } from 'react'
import { TextInput } from '../index'
import InvalidPersonIdMessage from '../Validation/InvalidPersonIdMessage'
import { isPersonIdValid } from '../../utils/personIdValidatorUtils'
import styled, { css } from 'styled-components'

interface Props {
  label?: string
  onFormattedChange: (id: string) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  value: string
  id?: string
}

const Wrapper = styled.div`
  width: 10.05em;
  margin-right: 0.5em;
`

const TextInputStyles = css`
  height: 50px;
`

const PersonIdInput: React.FC<Props> = ({ label, onFormattedChange, value, id }) => {
  const [displayError, setDisplayError] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFormattedChange(formatPersonId(event.currentTarget.value))
  }

  useEffect(() => {
    if (value === '') {
      setDisplayError(false)
    }
  }, [value])

  const formatPersonId = (id: string) => {
    let cleanId = id.replace(/\D/g, '')
    if (cleanId.length > 8) {
      cleanId = cleanId.slice(0, 8) + '-' + cleanId.slice(8, cleanId.length)
    }
    return cleanId
  }

  return (
    <>
      <Wrapper>
        <TextInput
          id={id}
          label={label}
          onChange={onChange}
          placeholder="ååååmmdd-nnnn"
          value={value}
          additionalStyles={TextInputStyles}
          limit={13}
          onBlur={() => {
            setDisplayError(value !== '' && !isPersonIdValid(value))
          }}
          onFocus={() => setDisplayError(false)}
          hasValidationError={displayError}
        />
      </Wrapper>
      <InvalidPersonIdMessage display={displayError} />
    </>
  )
}

export default PersonIdInput
