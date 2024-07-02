import type { ChangeEvent } from 'react'
import styled from 'styled-components'
import TextInput from '../../../../components/Inputs/TextInput'
import Icon from '../../../../components/image/image/Icon'

const StyledTextInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

export function WorkingHoursInput({
  onChange,
  value,
  hasValidationError,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: string
  hasValidationError: boolean
}) {
  return (
    <>
      <p className={'iu-fs-200 iu-fw-body'}>
        <Icon iconType={'lightbulb_outline'} includeTooltip={true} size={'sm'} />
        Patienten arbetar i snitt
      </p>
      <StyledTextInput
        onChange={onChange}
        value={value}
        limit={3}
        hasValidationError={hasValidationError}
        className="iu-mx-200 iu-fs-200"
        data-testid="workingHours"
        onKeyDown={(event) => {
          if (event.key === ' ') {
            event.preventDefault()
          }
        }}
      />
      <p className={'iu-fs-200 iu-fw-body'}>timmar/vecka</p>
    </>
  )
}
