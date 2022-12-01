import { Dropdown, TextInput, DatePickerCustom } from '@frontend/common'
import { ValueMedicalInvestigation, ConfigUeCodeItem, ConfigUeMedicalInvestigation } from '@frontend/common/src/types/certificate'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'

export interface Props {
  id: string
  disabled?: boolean
  config: ConfigUeMedicalInvestigation
  questionId: string
  value: ValueMedicalInvestigation
  onChange: (value: ValueMedicalInvestigation) => void
}

const UeMedicalInvestigation: React.FC<Props> = ({ id, disabled, config, questionId, onChange, value }) => {
  //const isShowValidationError = useSelector(getShowValidationErrors)
  // const questionValue = question.value as ValueMedicalInvestigation
  const hasValidationError = useSelector(getQuestionHasValidationError(questionId))
  // const typeOptions = config.typeOptions as ConfigUeCodeItem[]

  const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: '' }, ...config.typeOptions]

  const handleDescriptionChange = (text: string) => {
    onChange({ ...value, informationSource: { ...value.informationSource, text } })
  }

  const handleDateChange = (date: string) => {
    onChange({ ...value, date: { ...value.date, date } })
  }

  const handleSpecificationChange = (code: string) => {
    onChange({ ...value, investigationType: { ...value.investigationType, code } })
  }

  return (
    <>
      <div className="iu-grid-cols">
        <div>
          <Dropdown
            id={'type_' + id}
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
            id={'date_' + id}
            questionId={questionId}
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
            onChange={(event) => {
              handleDescriptionChange(event.currentTarget.value)
            }}
            id={'informationSource_' + id}
            hasValidationError={hasValidationError}
            value={''}
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

export default UeMedicalInvestigation
