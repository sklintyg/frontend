import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { formatPersonId, isPersonIdValid } from '../../utils/personIdValidatorUtils'
import InvalidPersonIdMessage from '../Validation/InvalidPersonIdMessage'
import TextInput from './TextInput'

interface Props {
  label?: string
  onFormattedChange: (id: string) => void
  onFocus?: () => void
  value: string
  id?: string
}

const Wrapper = styled.div`
  width: 13em;
  margin-right: 0.5em;
`

const TextInputStyles = css`
  height: 3rem;
`

const PersonIdInput = ({ label, onFormattedChange, value, id, onFocus }: Props) => {
  const [displayError, setDisplayError] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    const formattedValue = inputValue.replace(/\D/g, '')

    if (formattedValue.length === 12) {
      onFormattedChange(formatPersonId(formattedValue))
    } else {
      onFormattedChange(inputValue)
    }
  }

  useEffect(() => {
    if (value.length === 13) {
      setDisplayError(true)
    } else {
      setDisplayError(false)
    }
  }, [value])

  const handleFocus = () => {
    if (onFocus) {
      onFocus()
    }
    setDisplayError(false)
  }

  const hasValidationError = () => {
    return value !== '' && !isPersonIdValid(value)
  }

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^-?\d*$/.test(event.key)) {
      event.preventDefault()
    }
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
          css={TextInputStyles}
          limit={13}
          onBlur={() => {
            setDisplayError(true)
          }}
          onFocus={handleFocus}
          hasValidationError={displayError && hasValidationError()}
          autoComplete="off"
          onKeyPress={onKeyPress}
        />
        <InvalidPersonIdMessage display={displayError && hasValidationError()} />
      </Wrapper>
    </>
  )
}

export default PersonIdInput
