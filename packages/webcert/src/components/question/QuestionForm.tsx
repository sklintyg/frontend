import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Dropdown, Question, StatusWithIcon, ValidationText } from '@frontend/common'
import { ButtonWithConfirmModal, CustomButton, QuestionType, TextArea } from '@frontend/common/src'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, editQuestion, sendQuestion, updateQuestionDraftSaved } from '../../store/question/questionActions'
import _ from 'lodash'
import {
  isDisplayValidationMessages,
  isQuestionDraftSaved,
  isQuestionMissingMessage,
  isQuestionMissingType,
} from '../../store/question/questionSelectors'

interface Props {
  questionDraft: Question
}

const QuestionFormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Wrapper = styled.div`
  padding: 10px;
`

const QuestionForm: React.FC<Props> = ({ questionDraft }) => {
  const dispatch = useDispatch()
  const isFormEmpty = questionDraft.message === '' && questionDraft.type === QuestionType.MISSING
  const isSaved = useSelector(isQuestionDraftSaved)
  const isMissingType = useSelector(isQuestionMissingType)
  const isMissingMessage = useSelector(isQuestionMissingMessage)
  const showValidationMessages = useSelector(isDisplayValidationMessages)
  const [message, setMessage] = useState(questionDraft.message)
  const subjects: QuestionType[] = Object.values(QuestionType)

  useEffect(() => {
    setMessage(questionDraft.message)
  }, [questionDraft.message])

  const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const updatedQuestionDraft: Question = { ...questionDraft, type: event.currentTarget.value as QuestionType }
    dispatch(editQuestion(updatedQuestionDraft))
  }

  const dispatchEditDraft = useRef(
    _.debounce((questionDraft: Question, value: string) => {
      const updatedQuestionDraft = { ...questionDraft, message: value }
      dispatch(editQuestion(updatedQuestionDraft))
    }, 1000)
  ).current

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatchEditDraft(questionDraft, event.currentTarget.value)
    dispatch(updateQuestionDraftSaved(false))
    setMessage(event.currentTarget.value)
  }

  const handleSendQuestion = () => {
    dispatch(sendQuestion(questionDraft))
  }

  const handleDeleteQuestion = () => {
    dispatch(deleteQuestion(questionDraft))
  }

  const getQuestionTypeName = (type: QuestionType): string => {
    switch (type) {
      case QuestionType.MISSING:
        return 'Välj typ av fråga'
      case QuestionType.COORDINATION:
        return 'Avstämningsmöte'
      case QuestionType.CONTACT:
        return 'Kontakt'
      case QuestionType.OTHER:
        return 'Övrigt'
    }
  }

  const showTypeValidationError = () => showValidationMessages && isMissingType

  const showMessageValidationError = () => showValidationMessages && isMissingMessage

  return (
    <div className="ic-forms__group iu-bg-white iu-m-y-300">
      <Wrapper>
        <h4 className={'iu-fs-300'}>Här kan du ställa en ny fråga till Försäkringskassan.</h4>
        <div className="ic-forms__group">
          <Dropdown
            options={subjects.map((subject) => (
              <option key={subject} value={subject} label={getQuestionTypeName(subject)} />
            ))}
            onChange={onDropdownChange}
            id={'question_form_dropdown'}
            value={questionDraft.type}
            hasValidationError={showTypeValidationError()}
          />
          {showTypeValidationError() && (
            <ValidationText id="showTypeValidationError" message="Ange en rubrik för att kunna skicka frågan." />
          )}
        </div>
        <div className="ic-forms__group">
          <TextArea value={message} onChange={onTextAreaChange} hasValidationError={showMessageValidationError()} />
          {showMessageValidationError() && (
            <ValidationText id="showMessageValidationError" message="Skriv ett meddelande för att kunna skicka frågan." />
          )}
        </div>
        <QuestionFormFooter>
          <div className="ic-forms__group ic-button-group iu-my-400">
            <CustomButton
              disabled={isFormEmpty}
              style={'primary'}
              onClick={handleSendQuestion}
              text={'Skicka'}
              tooltipClassName={'iu-ml-none'}></CustomButton>
            <ButtonWithConfirmModal
              disabled={isFormEmpty}
              buttonStyle={'default'}
              modalTitle={'Radera påbörjad fråga'}
              confirmButtonText={'Ja, radera'}
              description={''}
              name={'Avbryt'}
              onConfirm={handleDeleteQuestion}>
              <p>Är du säker på att du vill radera din påbörjade fråga?</p>
            </ButtonWithConfirmModal>
          </div>
          {isSaved && <StatusWithIcon icon={'CheckIcon'}>Utkast sparat</StatusWithIcon>}
        </QuestionFormFooter>
      </Wrapper>
    </div>
  )
}

export default QuestionForm
