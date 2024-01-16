import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import RadioButton from '../../../../components/Inputs/RadioButton'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import { CertificateDataElement, ConfigLayout, ConfigUeRadioMultipleCodes, ValueCode } from '../../../../types'
import { GroupWrapper } from '../GroupWrappers'
import { ItemWrapper } from '../ItemWrapper'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeRadioGroup: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeRadioMultipleCodes
  const radiobuttons = config.list
  const [code, setCode] = useState((question.value as ValueCode)?.code)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const dispatch = useAppDispatch()
  const shouldBeHorizontal = config.layout !== ConfigLayout.COLUMN && radiobuttons.length <= 2

  const noItems = radiobuttons.length

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.currentTarget.value)
    const updatedValue = getUpdatedValue(question, event.currentTarget.value)
    dispatch(updateCertificateDataElement(updatedValue))
  }

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  return (
    radiobuttons && (
      <>
        <GroupWrapper layout={config.layout} role="radiogroup" className={`${validationErrors.length > 0 ? 'iu-mb-300' : ''}`}>
          {radiobuttons.map((radio, index) => (
            <ItemWrapper key={index} layout={shouldBeHorizontal ? ConfigLayout.INLINE : config.layout} index={index} noItems={noItems}>
              <RadioButton
                id={radio.id as string}
                value={radio.id}
                name={question.id}
                key={index}
                label={radio.label}
                disabled={disabled}
                checked={radio.id === code}
                hasValidationError={validationErrors.length > 0}
                onChange={handleChange}
              />
            </ItemWrapper>
          ))}
        </GroupWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </>
    )
  )
}

export default UeRadioGroup
