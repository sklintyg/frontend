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
    // This could probably be made better with RegEx replace?
    let returnString = acuityValue.replace(/\./gm, ',').replace(/[^0-9,]/g, '')
    if (returnString) {
      if (returnString.indexOf(',') < 0) {
        if (returnString.length > 1) {
          returnString = returnString.charAt(0) + ',' + returnString.charAt(1)
        }
      } else {
        const parts = returnString.split(',').slice(0, 2)
        if (!parts[0]) {
          parts[0] = '0'
        }
        if (parts[1].length > 1) {
          parts[1] = parts[1].substring(0, 1)
        }
        returnString = parts.join(',')
      }
    }
    return returnString
  }

  const parseFixed = (value: string) => {
    return value
      ? parseFloat(value.replace(',', '.'))
          .toFixed(1)
          .replace('.', ',')
      : ''
  }
  const [noCorrection, setNoCorrection] = useState(parseFixed(value.withoutCorrection.value?.toString() ?? ''))
  const [correction, setCorrection] = useState(parseFixed(value.withoutCorrection.value?.toString() ?? ''))
  const [contacts, setContacts] = useState(value?.contactLenses?.selected === true)

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
            checked={contacts}></Checkbox>
        )}
      </div>
    </>
  )
}

export default UeEyeAcuity
