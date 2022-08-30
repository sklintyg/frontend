import React, { ChangeEvent } from 'react'
import styled from 'styled-components/macro'
import { TextInput } from '@frontend/common'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'

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
  const spacePress = useKeyPress('Space')

  const onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault()
  }

  return (
    <>
      <p className={'iu-fs-200 iu-fw-body'}>Patienten arbetar i snitt</p>
      <StyledTextInput
        onChange={onChange}
        value={value}
        limit={3}
        hasValidationError={hasValidationError}
        autoComplete={false}
        className="iu-mx-200 iu-fs-200"
        testId="workingHours"
        onKeyDown={onKeyDown}
      />
      <p className={'iu-fs-200 iu-fw-body'}>timmar/vecka</p>
    </>
  )
}
