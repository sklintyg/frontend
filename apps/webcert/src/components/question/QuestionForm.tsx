import { debounce } from 'lodash-es'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { deleteQuestion, editQuestion, sendQuestion, updateQuestionDraftSaved } from '../../store/question/questionActions'
import {
  isDisplayValidationMessages,
  isQuestionDraftSaved,
  isQuestionFunctionDisabled,
  isQuestionMissingMessage,
  isQuestionMissingType,
} from '../../store/question/questionSelectors'
import { useAppDispatch } from '../../store/store'
import { Question, QuestionType } from '../../types'
import { CustomButton } from '../Inputs/CustomButton'
import Dropdown from '../Inputs/Dropdown'
import TextArea from '../Inputs/TextArea'
import ValidationText from '../Validation/ValidationText'
import ButtonWithConfirmModal from '../utils/Modal/ButtonWithConfirmModal'
import StatusWithIcon from '../utils/StatusWithIcon'

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
  const dispatch = useAppDispatch()
  const isFormEmpty = questionDraft.message === '' && questionDraft.type === QuestionType.MISSING
  const isSaved = useSelector(isQuestionDraftSaved)
  const isMissingType = useSelector(isQuestionMissingType)
  const isMissingMessage = useSelector(isQuestionMissingMessage)
  const showValidationMessages = useSelector(isDisplayValidationMessages)
  const [message, setMessage] = useState(questionDraft.message)
  const subjects: QuestionType[] = Object.values(QuestionType)
  const isFunctionDisabled = useSelector(isQuestionFunctionDisabled)

  useEffect(() => {
    setMessage(questionDraft.message)
  }, [questionDraft.message])

  const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const updatedQuestionDraft: Question = { ...questionDraft, type: event.currentTarget.value as QuestionType }
    dispatch(editQuestion(updatedQuestionDraft))
  }

  const dispatchEditDraft = useRef(
    debounce((questionDraft: Question, value: string) => {
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
    dispatchEditDraft.cancel()
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
      default:
        return type
    }
  }

  const showTypeValidationError = () => showValidationMessages && isMissingType

  const showMessageValidationError = () => showValidationMessages && isMissingMessage

  return (
    <div className="iu-mb-300">
      <div className="ic-forms__group iu-bg-white iu-m-y-300">
        <Wrapper>
          <h4 className={'iu-fs-300'}>Här kan du ställa en ny fråga till Försäkringskassan.</h4>
          <div className="ic-forms__group">
            <Dropdown
              onChange={onDropdownChange}
              id={'question_form_dropdown'}
              value={questionDraft.type}
              error={showTypeValidationError()}
            >
              {subjects
                .filter((subject) => subject !== QuestionType.COMPLEMENT)
                .map((subject) => (
                  <option key={subject} value={subject}>
                    {getQuestionTypeName(subject)}
                  </option>
                ))}
            </Dropdown>
            {showTypeValidationError() && (
              <ValidationText id="showTypeValidationError" message="Ange en rubrik för att kunna skicka frågan." />
            )}
          </div>
          <div className="ic-forms__group">
            <TextArea
              data-testid="question-textarea"
              value={message}
              onChange={onTextAreaChange}
              hasValidationError={showMessageValidationError()}
            />
            {showMessageValidationError() && (
              <ValidationText id="showMessageValidationError" message="Skriv ett meddelande för att kunna skicka frågan." />
            )}
          </div>
          <QuestionFormFooter>
            <div className="ic-forms__group ic-button-group iu-my-400">
              <CustomButton
                data-testid="question-send-btn"
                disabled={isFormEmpty || isFunctionDisabled || questionDraft.message !== message}
                buttonStyle={'primary'}
                onClick={handleSendQuestion}
                text={'Skicka'}
              />
              <ButtonWithConfirmModal
                disabled={isFormEmpty || isFunctionDisabled || questionDraft.message !== message}
                buttonStyle={'default'}
                modalTitle={'Radera påbörjad fråga'}
                confirmButtonText={'Ja, radera'}
                description={''}
                name={'Avbryt'}
                onConfirm={handleDeleteQuestion}
              >
                <p>Är du säker på att du vill radera din påbörjade fråga?</p>
              </ButtonWithConfirmModal>
            </div>
            {isSaved && <StatusWithIcon icon={'CheckIcon'}>Utkast sparat</StatusWithIcon>}
          </QuestionFormFooter>
        </Wrapper>
      </div>
    </div>
  )
}

export default QuestionForm
