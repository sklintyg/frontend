import React, { ChangeEvent } from 'react'
import styled from 'styled-components/macro'
import { TextInput } from '@frontend/common'

const StyledTextInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: string
  hasValidationError: boolean
}

export const WorkingHoursInput: React.FC<Props> = ({ onChange, value, hasValidationError }) => {
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  return (
    <>
      <p className={'iu-fs-200 iu-fw-body'}>Patienten arbetar i snitt</p>
      <StyledTextInput
        onChange={onChange}
        value={value}
        limit={2}
        error={hasValidationError}
        autoComplete="off"
        className="iu-mx-200 iu-fs-200"
        data-testid="workingHours"
        onKeyDown={onKeyDown}
      />
      <p className={'iu-fs-200 iu-fw-body'}>timmar/vecka</p>
    </>
  )
}
