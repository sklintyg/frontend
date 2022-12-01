import { CertificateDataElement, Dropdown, QuestionValidationTexts, TextInput, DatePickerCustom } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigationList,
  ValueCode,
} from '@frontend/common/src/types/certificate'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigation: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionValue = question.value as ValueMedicalInvestigation
  const config = question.config as ConfigUeMedicalInvestigationList
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const typeOptions = config.typeOptions as ConfigUeCodeItem[]
  const [selected, setSelected] = useState((question.value as ValueCode).code)

  useEffect(() => {
    if (disabled === false && selected != null) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, selected)))
    }
  }, [disabled, selected, question, dispatch])

  return (
    <>
      <div className="iu-grid-cols">
        <div>
          <Dropdown
            id="typeText"
            label=""
            options={typeOptions.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label}
              </option>
            ))}
            value={selected}
            disabled={disabled}
            onChange={(event) => setSelected(event.currentTarget.value)}
            hasValidationError={hasValidationError}
          />
        </div>
        <div>
          <DatePickerCustom
            id="dateText"
            forbidFutureDates={true}
            inputString={null}
            textInputOnChange={function(value: string, isValueValid?: boolean | undefined): void {
              throw new Error('Function not implemented.')
            }}
            displayValidationErrorOutline={false}
            setDate={(date: string) => {
              handleChange(date)
            }}
          />
        </div>
        <div>
          <TextInput id="informationSourceText" hasValidationError={hasValidationError} />
        </div>
        {isShowValidationError && (
          <ValidationWrapper>
            <QuestionValidationTexts validationErrors={question.validationErrors} />
          </ValidationWrapper>
        )}{' '}
      </div>
    </>
  )
}

export default UeMedicalInvestigation
