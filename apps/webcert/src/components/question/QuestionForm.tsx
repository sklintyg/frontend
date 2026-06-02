import { debounce } from 'lodash-es'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { getCertificateMessageTypes } from '../../store/certificate/certificateSelectors'
import { deleteQuestion, editQuestion, sendQuestion, updateQuestionDraftSaved } from '../../store/question/questionActions'
import {
  isDisplayValidationMessages,
  isQuestionDraftSaved,
  isQuestionFunctionDisabled,
  isQuestionMissingMessage,
  isQuestionMissingType,
} from '../../store/question/questionSelectors'
import { useAppDispatch, useAppSelector } from '../../store/store'
import type { Question } from '../../types'
import { QuestionType } from '../../types'
import { CustomButton } from '../Inputs/CustomButton'
import Dropdown from '../Inputs/Dropdown'
import TextArea from '../Inputs/TextArea'
import ValidationText from '../Validation/ValidationText'
import ButtonWithConfirmModal from '../utils/Modal/ButtonWithConfirmModal'
import StatusWithIcon from '../utils/StatusWithIcon'
import useIso8859Sanitization from '../../feature/certificate/UnifiedEdit/hooks/useIso8859Sanitization'
import InvalidCharactersInfoBox from '../../feature/certificate/UnifiedEdit/InvalidCharactersInfoBox'

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

const QuestionForm = ({ questionDraft }: Props) => {
  const dispatch = useAppDispatch()
  const isFormEmpty = questionDraft.message === '' && questionDraft.type === QuestionType.MISSING
  const isSaved = useAppSelector(isQuestionDraftSaved)
  const isMissingType = useAppSelector(isQuestionMissingType)
  const isMissingMessage = useAppSelector(isQuestionMissingMessage)
  const showValidationMessages = useAppSelector(isDisplayValidationMessages)
  const messageTypes = useAppSelector(getCertificateMessageTypes, shallowEqual)
  const isFunctionDisabled = useAppSelector(isQuestionFunctionDisabled)
  const MAX_NUMBER_OF_ALLOWED_CHARACTERS: number = 4999
  const rawInitialMessage = questionDraft.message
  const { sanitize, resetWarning, showWarning, sanitizedInitialValue: sanitizedInitialDesc } = useIso8859Sanitization(rawInitialMessage)
  const [message, setMessage] = useState(sanitizedInitialDesc)

  useEffect(() => {
    if (sanitizedInitialDesc !== rawInitialMessage) {
      dispatch(editQuestion({ ...questionDraft, message: sanitizedInitialDesc }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const sanitized = sanitize(event.currentTarget.value)
    dispatchEditDraft(questionDraft, sanitized)
    dispatch(updateQuestionDraftSaved(false))
    setMessage(sanitized)
  }

  const handleSendQuestion = () => {
    dispatchEditDraft.cancel()
    resetWarning()
    dispatch(sendQuestion(questionDraft))
  }

  const handleDeleteQuestion = () => {
    resetWarning()
    dispatch(deleteQuestion(questionDraft))
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
              aria-label="Välj typ av fråga"
            >
              {messageTypes.map(({ type, subject }) => (
                <option key={type} value={type}>
                  {subject}
                </option>
              ))}
            </Dropdown>
            {showTypeValidationError() && (
              <ValidationText id="showTypeValidationError" message="Ange en rubrik för att kunna skicka frågan." />
            )}
          </div>
          <div className="ic-forms__group">
            <TextArea
              maxLength={MAX_NUMBER_OF_ALLOWED_CHARACTERS}
              data-testid="question-textarea"
              value={message}
              onChange={onTextAreaChange}
              hasValidationError={showMessageValidationError()}
              aria-label="Fråga"
            />
            {showMessageValidationError() && (
              <ValidationText id="showMessageValidationError" message="Skriv ett meddelande för att kunna skicka frågan." />
            )}
          </div>
          <InvalidCharactersInfoBox visible={showWarning} />
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
