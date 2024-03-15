import { format } from 'date-fns'
import { debounce } from 'lodash-es'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { CheckIcon, calendarImage, userImage } from '../../images'
import arrowLeft from '../../images/arrow-left.svg'
import {
  createAnswer,
  deleteAnswer,
  editAnswer,
  gotoComplement,
  handleQuestion,
  sendAnswer,
  updateAnswerDraftSaved,
} from '../../store/question/questionActions'
import { isAnswerDraftSaved, isQuestionFunctionDisabled } from '../../store/question/questionSelectors'
import { Answer, CertificateStatus, Question, QuestionType, ResourceLinkType } from '../../types'
import { getResourceLink } from '../../utils'
import Checkbox from '../Inputs/Checkbox'
import { CustomButton } from '../Inputs/CustomButton'
import TextArea from '../Inputs/TextArea'
import { ExpandableText } from '../utils/ExpandableText'
import ButtonWithConfirmModal from '../utils/Modal/ButtonWithConfirmModal'
import CheckboxWithConfirmModal from '../utils/Modal/CheckboxWithConfirmModal'
import StatusWithIcon from '../utils/StatusWithIcon'
import fkImg from './fk.png'

// TODO: Replace color with var(--color-grey-400)
const QuestionHeader = styled.div`
  border-bottom: 1px solid #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Reminder = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  padding: 5px;
`

const ComplementCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;

  &:hover {
    p {
      color: white !important;
    }

    img {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(3539%) hue-rotate(184deg) brightness(110%) contrast(101%);
    }
  }
`

const AnsweredByCertificate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Complement = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  padding: 5px;
`

const Card = styled.div`
  margin: 0 0 10px 0;
  padding: 10px;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const QuestionFormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FormattedText = styled.p`
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: pre-line;
`

const FormattedTextStyles = css`
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: pre-line;
`

const CheckboxStyles = css`
  margin-left: auto;
`

const FlexEndDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE = 'Kompletteringsbegäran har besvarats med ett meddelande.'

interface Props {
  question: Question
}

const QuestionItem: React.FC<Props> = ({ question }) => {
  const dispatch = useDispatch()
  const isSaved = useSelector(isAnswerDraftSaved(question.id))
  const isFormEmpty = !question.answer?.message
  const incommingMessage = question.answer?.message ?? ''
  const [message, setMessage] = useState(incommingMessage)
  const isFunctionDisabled = useSelector(isQuestionFunctionDisabled)

  useEffect(() => {
    setMessage(incommingMessage)
  }, [incommingMessage])

  const dispatchEditAnswer = useRef(
    debounce((question: Question, value: string) => {
      const updatedAnswer = { ...question.answer, message: value } as Answer
      dispatch(editAnswer({ questionId: question.id, answer: updatedAnswer }))
    }, 1000)
  ).current

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatchEditAnswer(question, event.currentTarget.value)
    dispatch(updateAnswerDraftSaved({ questionId: question.id, isAnswerDraftSaved: false }))
    setMessage(event.currentTarget.value)
  }

  const getImageSrc = (author: string) => {
    return author === 'Försäkringskassan' ? fkImg : userImage
  }

  const handleCreateAnswer = () => dispatch(createAnswer(question))

  const handleSendAnswer = () => dispatch(sendAnswer({ questionId: question.id, answer: { ...question.answer } as Answer }))

  const handleDeleteAnswer = () => dispatch(deleteAnswer(question))

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    dispatch(
      handleQuestion({
        questionId: question.id,
        handled: event.currentTarget.checked,
      })
    )

  const handleSelect = (isSelected: boolean) =>
    dispatch(
      handleQuestion({
        questionId: question.id,
        handled: isSelected,
      })
    )

  const isAnswerButtonVisible = () => !question.answer && getResourceLink(question.links, ResourceLinkType.ANSWER_QUESTION)?.enabled

  const isLastDateToReplyVisible = () => !question.handled && question.lastDateToReply

  const isHandleCheckboxVisible = () => getResourceLink(question.links, ResourceLinkType.HANDLE_QUESTION)?.enabled

  const isRemindersVisible = () => question.reminders.length > 0 && !question.handled

  const isComplementsVisible = () => question.complements.length > 0

  const isComplementQuestion = () => question.type === QuestionType.COMPLEMENT

  const onClickComplement = (questionId: string, valueId: string): void => {
    dispatch(gotoComplement({ questionId, valueId }))
  }

  const getAnsweredByCertificate = (question: Question) => {
    return (
      <AnsweredByCertificate
        key={question.id}
        className={`iu-bg-success-light iu-fullwidth iu-border-success-light iu-radius-card iu-mt-800 iu-mb-200`}
      >
        <CheckIcon />
        <Complement key={question.id} className={'iu-fullwidth'}>
          <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
            <Wrapper>
              <div className={'iu-fullwidth iu-color-black iu-text-left'}>
                Kompletteringsbegäran besvarades med ett nytt intyg.{' '}
                <Link className={'iu-color-black'} to={`/certificate/${question.answeredByCertificate?.certificateId}`}>
                  Öppna intyget
                </Link>
              </div>
            </Wrapper>
          </div>
        </Complement>
      </AnsweredByCertificate>
    )
  }

  const getAnsweredByMessage = () => {
    return (
      <AnsweredByCertificate
        key={question.id}
        className={`iu-bg-success-light iu-fullwidth iu-border-success-light iu-radius-card iu-my-800`}
      >
        <CheckIcon />
        <Complement key={question.id} className={'iu-fullwidth'}>
          <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
            <Wrapper>
              <div className={'iu-fullwidth iu-color-black iu-text-left'}>{COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE}</div>
            </Wrapper>
          </div>
        </Complement>
      </AnsweredByCertificate>
    )
  }

  const isAnsweredByCertificate = (question: Question) =>
    question.answeredByCertificate && question.answeredByCertificate.status === CertificateStatus.SIGNED

  const isComplementAnsweredByMessage = (question: Question) => question.type === QuestionType.COMPLEMENT && question.answer

  return (
    <Card key={question.id} className={'ic-card'}>
      <QuestionHeader>
        <img src={getImageSrc(question.author)} className={'iu-mr-200'} alt={'Avsändarebild'} />
        <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
          <Wrapper>
            <p className="iu-fw-heading">{question.author}</p>
            {isHandleCheckboxVisible() &&
              (isComplementQuestion() ? (
                <CheckboxWithConfirmModal
                  id={question.id}
                  checked={question.handled}
                  disabled={false}
                  buttonStyle={'default'}
                  modalTitle={'Markera som hanterad'}
                  confirmButtonText={'Markera som hanterad'}
                  name={'Hanterad'}
                  onConfirm={handleSelect}
                  wrapperStyles={CheckboxStyles}
                >
                  <p>När ett intyg markeras som hanterad kan detta inte ångras senare.</p>
                </CheckboxWithConfirmModal>
              ) : (
                <Checkbox
                  id={'hanterad' + question.id}
                  label="Hanterad"
                  value="hanterad"
                  checked={question.handled}
                  vertical={true}
                  disabled={false}
                  onChange={handleChange}
                />
              ))}
            {!isHandleCheckboxVisible() && question.handled && (
              <StatusWithIcon icon={'CheckIcon'} additionalTextStyles={'iu-fs-200 iu-color-grey-400'}>
                Hanterad
              </StatusWithIcon>
            )}
          </Wrapper>
          <Wrapper>
            <div>
              {question.contactInfo && question.contactInfo.length > 0 && <p>{question.contactInfo.join(', ')}</p>}
              <p className={'iu-fw-heading iu-m-none'}>{question.subject}</p>
            </div>
            <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(question.sent), 'yyyy-MM-dd HH:mm')}</p>
          </Wrapper>
        </div>
      </QuestionHeader>
      {isRemindersVisible() &&
        question.reminders.map((reminder) => (
          <div key={reminder.id} className={`ic-alert ic-alert--status ic-alert--info iu-p-none iu-my-400`}>
            <Reminder className={'iu-fullwidth '}>
              <i className={`ic-alert__icon ic-info-icon iu-m-none`} />
              <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
                <Wrapper>
                  <p className={'iu-fw-heading'}>{'Påminnelse'}</p>
                  <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(reminder.sent), 'yyyy-MM-dd HH:mm')}</p>
                </Wrapper>
                <Wrapper>
                  <FormattedText className={'iu-fullwidth'}>{reminder.message}</FormattedText>
                </Wrapper>
              </div>
            </Reminder>
          </div>
        ))}
      {question.forwarded && (
        <FlexEndDiv>
          <StatusWithIcon icon={'CheckIcon'} additionalTextStyles={'iu-fs-200'}>
            Vidarebefordrad
          </StatusWithIcon>
        </FlexEndDiv>
      )}
      <div className={question.message ? (isComplementsVisible() ? 'iu-mb-300' : 'iu-mb-800') : 'iu-mb-200'}>
        {isComplementQuestion() ? (
          <ExpandableText text={question.message} maxLength={230} additionalStyles={FormattedTextStyles} />
        ) : (
          <FormattedText>{question.message}</FormattedText>
        )}
      </div>
      {isComplementsVisible() &&
        question.complements.map((complement) => (
          <ComplementCard
            key={complement.questionId}
            className={`ic-button iu-fullwidth iu-border-main iu-radius-card iu-mb-200`}
            onClick={() => onClickComplement(complement.questionId, complement.valueId)}
          >
            <img
              src={arrowLeft}
              className={'iu-svg-icon iu-ml-200'}
              style={{ width: '1rem', height: '1rem', transform: 'rotate(90deg)' }}
              alt={'Pil'}
            />
            <Complement key={complement.questionId} className={'iu-fullwidth'}>
              <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
                <Wrapper>
                  <p className={'iu-fw-heading iu-color-grey-400 iu-mb-200'}>{'Visa kompletteringsbegäran för:'}</p>
                </Wrapper>
                <Wrapper>
                  <p className={'iu-fullwidth iu-color-main iu-text-left'}>{complement.questionText}</p>
                </Wrapper>
              </div>
            </Complement>
          </ComplementCard>
        ))}
      {isLastDateToReplyVisible() && (
        <p className={'iu-mb-300 iu-color-text iu-fs-200'}>
          <img src={calendarImage} alt="kalender" className="iu-mr-200" style={{ display: 'inline', maxHeight: '1rem' }} />
          Svara senast: {question.lastDateToReply}
        </p>
      )}
      {isAnswerButtonVisible() && <CustomButton buttonStyle={'primary'} onClick={handleCreateAnswer} text={'Svara'} />}
      {question.answer && !question.answer.id && (
        <>
          <div className="ic-forms__group">
            <TextArea value={message} onChange={onTextAreaChange} />
          </div>
          <QuestionFormFooter>
            <div className="ic-forms__group ic-button-group iu-my-400">
              <CustomButton
                disabled={isFormEmpty || isFunctionDisabled || question.answer.message !== message}
                buttonStyle={'primary'}
                onClick={handleSendAnswer}
                text={'Skicka'}
              />
              <ButtonWithConfirmModal
                disabled={isFormEmpty || isFunctionDisabled || question.answer.message !== message}
                buttonStyle={'default'}
                modalTitle={'Radera påbörjad svar'}
                confirmButtonText={'Ja, radera'}
                description={''}
                name={'Avbryt'}
                onConfirm={handleDeleteAnswer}
              >
                <p>Är du säker på att du vill radera ditt påbörjade svar?</p>
              </ButtonWithConfirmModal>
            </div>
            {isSaved && <StatusWithIcon icon={'CheckIcon'}>Utkast sparat</StatusWithIcon>}
          </QuestionFormFooter>
        </>
      )}
      {isComplementAnsweredByMessage(question) && getAnsweredByMessage()}
      {question.answer && question.answer.id && (
        <>
          <QuestionHeader>
            <img src={getImageSrc(question.answer.author)} className={'iu-mr-200'} alt={'Avsändarebild'} />
            <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
              <Wrapper>
                <p className={'iu-fw-heading'}>{question.answer.author}</p>
              </Wrapper>
              <Wrapper>
                <div>
                  {question.answer.contactInfo && question.answer.contactInfo.length > 0 && <p>{question.answer.contactInfo.join(', ')}</p>}
                  <p className={'iu-fw-heading iu-m-none'}>{'Re: ' + question.subject}</p>
                </div>
                <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(question.answer.sent), 'yyyy-MM-dd HH:mm')}</p>
              </Wrapper>
            </div>
          </QuestionHeader>
          <p className={'iu-mb-400'}>{question.answer.message}</p>
        </>
      )}
      {isAnsweredByCertificate(question) && getAnsweredByCertificate(question)}
    </Card>
  )
}

export default QuestionItem
