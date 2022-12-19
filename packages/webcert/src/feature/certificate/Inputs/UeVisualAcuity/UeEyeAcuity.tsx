import { Checkbox, ConfigEyeAcuity, TextInput, ValueEyeAcuity } from '@frontend/common'
import React from 'react'
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

  const onNoCorrectionChange = (noCorrectionValue: string) => {
    noCorrectionValue = parseAcuity(noCorrectionValue)
    onChange({ ...value, withoutCorrection: { ...value.withoutCorrection, value: parseFloat(noCorrectionValue) } })
  }

  const onCorrectionChange = (correctionValue: string) => {
    correctionValue = parseAcuity(correctionValue)
    onChange({ ...value, withCorrection: { ...value.withCorrection, value: parseFloat(correctionValue) } })
  }

  const onContactsChange = (selected: boolean) => {
    if (value.contactLenses) {
      onChange({ ...value, contactLenses: { ...value.contactLenses, selected } })
    }
  }

  return (
    <>
      <div className="iu-grid-cols-3">{config.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          disabled={disabled}
          id={config.withoutCorrectionId}
          value={value.withoutCorrection.value?.toString() ?? ''}
          limit={3}
          onChange={(event) => {
            onNoCorrectionChange(event.currentTarget.value)
          }}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          disabled={disabled}
          id={config.withCorrectionId}
          value={value.withCorrection.value?.toString() ?? ''}
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
            checked={value.contactLenses?.selected === true}></Checkbox>
        )}
      </div>
    </>
  )
}

export default UeEyeAcuity
