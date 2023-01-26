import { CertificateDataElement, ConfigUeDropdown, Dropdown, QuestionValidationTexts, ValueCode } from '@frontend/common'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeDropdown: React.FC<Props> = (props) => {
  const { question, disabled } = props
  const dispatch = useAppDispatch()
  const config = question.config as ConfigUeDropdown
  const [selected, setSelected] = React.useState((question.value as ValueCode).code)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue
    return updatedQuestion
  }

  useEffect(() => {
    if (disabled === false && selected != null) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, selected)))
    }
  }, [disabled, selected, question, dispatch])

  return (
    <>
      <Dropdown
        id={question.id}
        label={config.label}
        disabled={disabled}
        onChange={(event) => setSelected(event.currentTarget.value)}
        value={selected}
        error={validationErrors.length > 0}>
        {config.list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </Dropdown>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}
export default UeDropdown
