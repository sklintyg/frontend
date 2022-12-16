import { Checkbox, ConfigEyeAcuity, TextInput, ValueEyeAcuity } from '@frontend/common'
import React, { useState } from 'react'
import styled from 'styled-components'

export interface Props {
  disabled?: boolean
  config: ConfigEyeAcuity
  value: ValueEyeAcuity
}
const AcuityInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

const UeEyeAcuity: React.FC<Props> = ({ disabled, config, value }) => {
  const [noCorrection, setNoCorrection] = useState(value.withoutCorrection.value?.toString() ?? '')
  const [correction, setCorrection] = useState(value.withCorrection.value?.toString() ?? '')
  const [contacts, setContacts] = useState(value.contactLenses?.selected === true)

  const parseAcuity = (value: string) => {
    value = value.replace(/\./gm, ',').replace(/[^0-9,]/g, '')
    return value
  }

  const onNoCorrectionChange = (value: string) => {
    value = parseAcuity(value)
    setNoCorrection(value)
  }

  const onCorrectionChange = (value: string) => {
    value = parseAcuity(value)
    setCorrection(value)
  }

  const onContactsChange = (selected: boolean) => {
    setContacts(selected)
  }

  return (
    <>
      <div className="iu-grid-cols-3">{config.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          disabled={disabled}
          id={config.withoutCorrectionId}
          value={noCorrection}
          limit={3}
          onChange={(event) => {
            onNoCorrectionChange(event.currentTarget.value)
          }}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          disabled={disabled}
          id={config.withCorrectionId}
          value={correction}
          limit={3}
          onChange={(event) => {
            onCorrectionChange(event.currentTarget.value)
          }}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        {config.contactLensesId && (
          <Checkbox
            disabled={disabled}
            id={config.contactLensesId}
            onChange={(event) => {
              onContactsChange(event.currentTarget.checked)
            }}
            checked={contacts}></Checkbox>
        )}
      </div>
    </>
  )
}

export default UeEyeAcuity
