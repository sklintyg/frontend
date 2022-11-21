import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config
  const questionValue = question.value as ValueCauseOfDeathList
  const causes = (questionConfig as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const dispatch = useAppDispatch()

  const getNoVisible = () => {
    let no = 2
    questionValue.list.forEach((value, index) => {
      if (index > 1 && (value.description.text || value.debut.date || value.specification.code)) {
        no = index + 1
      }
    })
    return no
  }

  const [noVisible, setNoVisible] = useState(getNoVisible())

  const addRowClick = () => {
    if (noVisible < causes.length) {
      setNoVisible(noVisible + 1)
    }
  }

  const deleteRow = (id: string) => {
    dispatch(updateCertificateDataElement(deleteItem(question, id)))
    setNoVisible(getNoVisible())
  }

  return (
    <div>
      <div>
        {causes &&
          causes.map((cause, index) => {
            let visible = false
            if (index < noVisible) {
              visible = true
            }
            const value: ValueCauseOfDeath = questionValue.list
              ? (questionValue.list.find((item) => item.id === cause.id) as ValueCauseOfDeath)
              : ({ id: cause.id } as ValueCauseOfDeath)

            if (visible) {
              return (
                <UeCauseOfDeathControl
                  config={cause}
                  value={value}
                  key={index}
                  canBeDeleted={index > 0}
                  disabled={disabled}
                  hasValidationError={shouldDisplayValidationError}
                  question={question}
                  deleteRow={() => deleteRow(cause.id)}
                />
              )
            } else return <span key={index}></span>
          })}
      </div>
      <CustomButton
        disabled={disabled || noVisible >= causes.length}
        buttonStyle={'primary'}
        text="Lägg till ytterligare sjukdom"
        onClick={addRowClick}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

const deleteItem = (question: CertificateDataElement, id: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }
  const questionConfig = { ...(updatedQuestion.config as ConfigureUeCauseOfDeathList) }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueCauseOfDeathList) }
  const newValues: ValueCauseOfDeath[] = []

  let previousId: string | undefined
  let move = false

  questionConfig.list.forEach((config) => {
    if (!previousId) {
      newValues.push(updatedQuestionValue.list.find((item) => item.id === config.id) as ValueCauseOfDeath)
    } else if (config.id === id) {
      move = true
    } else if (move) {
      const updatedQuestionItem: ValueCauseOfDeath = updatedQuestionValue.list.find((item) => item.id === config.id) as ValueCauseOfDeath
      updatedQuestionItem.id = previousId
      newValues.push(updatedQuestionItem)
      move = true
    }
    previousId = config.id
  })

  if (move) {
    newValues.push({
      id: previousId,
      description: {
        type: CertificateDataValueType.TEXT,
        id: questionConfig.list[0].descriptionId,
      },
      debut: {
        type: CertificateDataValueType.DATE,
        id: questionConfig.list[0].debutId,
      },
      specification: {
        type: CertificateDataValueType.CODE,
      },
      type: CertificateDataValueType.CAUSE_OF_DEATH,
    } as ValueCauseOfDeath)
  }
  updatedQuestionValue.list = newValues
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeCauseOfDeathList
