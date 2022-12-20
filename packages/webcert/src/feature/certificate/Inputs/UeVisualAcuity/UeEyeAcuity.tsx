import { Checkbox, ConfigEyeAcuity, TextInput, ValueEyeAcuity } from '@frontend/common'
import React, { useState } from 'react'
import styled from 'styled-components'

export interface Props {
  disabled?: boolean
  config: ConfigEyeAcuity
  value: ValueEyeAcuity
  onChange: (value: ValueEyeAcuity) => void
}
const AcuityInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

const UeEyeAcuity: React.FC<Props> = ({ disabled, config, value, onChange }) => {
  const parseAcuity = (acuityValue: string) => {
    acuityValue = acuityValue.replace(/\./gm, ',').replace(/[^0-9,]/g, '')
    return acuityValue
  }
  const [noCorrection, setNoCorrection] = useState(parseAcuity(value.withoutCorrection.value?.toString() ?? ''))
  const [correction, setCorrection] = useState(parseAcuity(value.withCorrection.value?.toString() ?? ''))
  const [contacts, setContacts] = useState(value?.contactLenses?.checked === true)

  const onNoCorrectionChange = (noCorrectionValue: string) => {
    noCorrectionValue = parseAcuity(noCorrectionValue)

    setNoCorrection(noCorrectionValue)
    if (parseFloat(noCorrectionValue)) {
      onChange({ ...value, withoutCorrection: { ...value.withoutCorrection, value: parseFloat(noCorrectionValue.replace(/,/gm, '.')) } })
    }
  }

  const onCorrectionChange = (correctionValue: string) => {
    correctionValue = parseAcuity(correctionValue)
    setCorrection(correctionValue)
    if (parseFloat(correctionValue)) {
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
          }}></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
        <AcuityInput
          disabled={disabled}
          id={config.withCorrectionId}
          value={correction}
          limit={3}
          onChange={(event) => {
            onCorrectionChange(event.currentTarget.value)
          }}></AcuityInput>
      </div>
      <div className="iu-grid-span-3">
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
