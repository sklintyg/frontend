import { Dropdown, TextInput, DatePickerCustom } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigation,
  CertificateDataElement,
  ValueMedicalInvestigationList,
  ValueText,
  CertificateDataValueType,
} from '@frontend/common/src/types/certificate'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'

export interface Props {
  disabled?: boolean
  config: ConfigUeMedicalInvestigation
  question: CertificateDataElement
  value: ValueMedicalInvestigation
  onChange: (value: ValueMedicalInvestigation) => void
}

  question: CertificateDataElement
  //const isShowValidationError = useSelector(getShowValidationErrors)
  // const questionValue = question.value as ValueMedicalInvestigation
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  // const typeOptions = config.typeOptions as ConfigUeCodeItem[]
  const savedValue = (question.value as ValueMedicalInvestigationLi, questionind((item) => item && item.id === config.id))
  const [informationSource, setInformationSource] = useState(savedValue !== undefined ? (savedValue.informationSource as ValueText) : '')
  const [code, setCode] = useState(savedValue !== undefined ? savedValue.code : '')
  const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: '' }, ...config.typeOptions]

  const handleInformationSourceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newText = event.currentTarget.value

    const informationSourceValue: ValueText = {
      type: CertificateDataValueType.TEXT,
      id: config.informationSourceId,
      text: newText,
    }

    setInformationSource(informationSourceValue)

    // onChange({ ...value, informationSource: { ...value.informationSource, text } })
    //setText(onChange, value, text)
  }

  const handleDateChange = (date: string) => {
    onChange({ ...value, date: { ...value.date, date } })
  }

  const handleSpecificationChange = (code: string) => {
    onChange({ ...value, investigationType: { ...value.investigationType, code } })
    const specificationId = config.specifications.find((s) => s.code === code)?.id ?? ''
    onChange({ ...value, investigationType: { ...value.investigationType, id: typeId, code: code } })
  }

  return (
    <>
      <div className="iu-grid-cols">
        <div>
          <Dropdown
            id={config.typeId}
            label=""
            options={
              typeOptions &&
              typeOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))
            }
            value={''}
            disabled={disabled}
            onChange={(event) => {
              handleSpecificationChange(event.currentTarget.value)
            }}
            hasValidationError={hasValidationError}
          />
        </div>
        <div>
          <DatePickerCustom
            id={config.dateId}
            questionId={question.id}
            forbidFutureDates={true}
            inputString={''}
            textInputOnChange={handleDateChange}
            displayValidationErrorOutline={false}
            setDate={(date: string) => {
              handleDateChange(date)
            }}
          />
        </div>
        <div>
          <TextInput
            onChange={handleInformationSourceChange}
            id={config.informationSourceId}
            hasValidationError={hasValidationError}
            value={informationSource.text ?? ''}
          />
        </div>
        {/* {isShowValidationError && (
          <ValidationWrapper>
            <QuestionValidationTexts validationErrors={question.validationErrors} />
          </ValidationWrapper>
        )}{' '} */}
      </div>
    </>
  )
}

function setText(onChange: (value: ValueMedicalInvestigation) => void, value: ValueMedicalInvestigation, text: string) {
  console.log(value)
  onChange({ ...value, informationSource: { ...value.informationSource, text } })
  // const index = values.informationSource.findIndex((text: ValueText) => text.id === id)
  // if (index !== -1) {
  //   return value.informationSource[index].text
  // } else {
  //   return null
  // }
}

export default UeMedicalInvestigation
