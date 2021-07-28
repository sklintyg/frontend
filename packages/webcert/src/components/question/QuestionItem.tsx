import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Answer,
  ButtonWithConfirmModal,
  CertificateStatus,
  Checkbox,
  CheckboxWithConfirmModal,
  CustomButton,
  getResourceLink,
  Question,
  QuestionType,
  ResourceLinkType,
  StatusWithIcon,
  TextArea,
} from '@frontend/common'
import { format } from 'date-fns'
import fkImg from './fk.png'
import userImage from '../../images/user-image.svg'
import arrowLeft from '../../images/arrow-left.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAnswer,
  deleteAnswer,
  editAnswer,
  gotoComplement,
  handleQuestion,
  sendAnswer,
  updateAnswerDraftSaved,
} from '../../store/question/questionActions'
import _ from 'lodash'
import { isAnswerDraftSaved } from '../../store/question/questionSelectors'
import { Link } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  border-bottom: 10px solid #f7f4f2;
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

interface Props {
  question: Question
}

const QuestionItem: React.FC<Props> = ({ question }) => {
  const dispatch = useDispatch()
  const isSaved = useSelector(isAnswerDraftSaved(question.id))
  const isFormEmpty = !question.answer?.message
  const [message, setMessage] = useState(question.answer?.message ?? '')

  useEffect(() => {
    setMessage(question.answer?.message ?? '')
  }, [question.answer?.message])

  const dispatchEditAnswer = useRef(
    _.debounce((question: Question, value: string) => {
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

  const isHandleCheckboxVisible = () => getResourceLink(question.links, ResourceLinkType.HANDLE_QUESTION)?.enabled

  const isRemindersVisible = () => question.reminders.length > 0 && !question.handled

  const isComplementsVisible = () => question.complements.length > 0

  const isComplementQuestion = () => question.type === QuestionType.COMPLEMENT

  const onClickComplement = (questionId: string, valueId: string): void => {
    dispatch(gotoComplement({ questionId, valueId }))
  }

  const getAnsweredByCertificate = (question: Question) => {
    return (
      <AnsweredByCertificate key={question.id} className={`ic-button iu-fullwidth iu-border-main iu-radius-card iu-mt-800 iu-mb-200`}>
        <FontAwesomeIcon icon={faCheck} className={`iu-color-white`} size="1x" />
        <Complement key={question.id} className={'iu-fullwidth'}>
          <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
            <Wrapper>
              <div className={'iu-fullwidth iu-color-white iu-text-left'}>
                Kompletteringsbegäran besvarades med ett nytt intyg.{' '}
                <Link className={'iu-color-white'} to={`/certificate/${question.answeredByCertificate?.certificateId}`}>
                  Öppna intyget
                </Link>
              </div>
            </Wrapper>
          </div>
        </Complement>
      </AnsweredByCertificate>
    )
  }

  const isAnsweredByCertificate = (question: Question) =>
    question.answeredByCertificate && question.answeredByCertificate.status === CertificateStatus.SIGNED

  return (
    <Card key={question.id} className={'ic-card'}>
      <QuestionHeader>
        <img src={getImageSrc(question.author)} className={'iu-mr-200'} alt={'Avsändarebild'} />
        <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
          <Wrapper>
            <p className={'iu-fw-heading'}>{question.author}</p>
            {isHandleCheckboxVisible() &&
              (isComplementQuestion() ? (
                <CheckboxWithConfirmModal
                  checked={question.handled}
                  disabled={false}
                  buttonStyle={'default'}
                  modalTitle={'Markera som hanterad'}
                  confirmButtonText={'Markera som hanterad'}
                  name={'Hanterad'}
                  onConfirm={(isSelected: boolean) => handleSelect(isSelected)}>
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
            <p className={'iu-fw-heading'}>{question.subject}</p>
            <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(question.sent), 'yyyy-MM-dd HH:mm')}</p>
          </Wrapper>
        </div>
      </QuestionHeader>
      {isRemindersVisible() &&
        question.reminders.map((reminder) => (
          <div className={`ic-alert ic-alert--status ic-alert--info iu-p-none iu-my-400`}>
            <Reminder key={reminder.id} className={'iu-fullwidth '}>
              <i className={`ic-alert__icon ic-info-icon iu-m-none`} />
              <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
                <Wrapper>
                  <p className={'iu-fw-heading'}>{'Påminnelse'}</p>
                  <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(reminder.sent), 'yyyy-MM-dd HH:mm')}</p>
                </Wrapper>
                <Wrapper>
                  <div className={'iu-fullwidth'}>{reminder.message}</div>
                </Wrapper>
              </div>
            </Reminder>
          </div>
        ))}
      <p className={question.message ? (isComplementsVisible() ? 'iu-mb-300' : 'iu-mb-800') : 'iu-mb-200'}>{question.message}</p>
      {isComplementsVisible() &&
        question.complements.map((complement) => (
          <ComplementCard
            key={complement.questionId}
            className={`ic-button iu-fullwidth iu-border-main iu-radius-card iu-mb-200`}
            onClick={() => onClickComplement(complement.questionId, complement.valueId)}>
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
                  <div className={'iu-fullwidth iu-color-main  iu-text-left'}>{complement.questionText}</div>
                </Wrapper>
              </div>
            </Complement>
          </ComplementCard>
        ))}
      {isAnswerButtonVisible() && (
        <CustomButton buttonStyle={'primary'} onClick={handleCreateAnswer} text={'Svara'} tooltipClassName={'iu-ml-none'} />
      )}
      {question.answer && !question.answer.id && (
        <>
          <div className="ic-forms__group">
            <TextArea value={message} onChange={onTextAreaChange} />
          </div>
          <QuestionFormFooter>
            <div className="ic-forms__group ic-button-group iu-my-400">
              <CustomButton
                disabled={isFormEmpty}
                buttonStyle={'primary'}
                onClick={handleSendAnswer}
                text={'Skicka'}
                tooltipClassName={'iu-ml-none'}
              />
              <ButtonWithConfirmModal
                disabled={false}
                buttonStyle={'default'}
                modalTitle={'Radera påbörjad svar'}
                confirmButtonText={'Ja, radera'}
                description={''}
                name={'Avbryt'}
                onConfirm={handleDeleteAnswer}>
                <p>Är du säker på att du vill radera ditt påbörjade svar?</p>
              </ButtonWithConfirmModal>
            </div>
            {isSaved && <StatusWithIcon icon={'CheckIcon'}>Utkast sparat</StatusWithIcon>}
          </QuestionFormFooter>
        </>
      )}
      {question.answer && question.answer.id && (
        <>
          <QuestionHeader>
            <img src={getImageSrc(question.answer.author)} className={'iu-mr-200'} alt={'Avsändarebild'} />
            <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
              <Wrapper>
                <p className={'iu-fw-heading'}>{question.answer.author}</p>
              </Wrapper>
              <Wrapper>
                <p className={'iu-fw-heading'}>{'Re: ' + question.subject}</p>
                <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(question.answer.sent), 'yyyy-MM-dd HH:mm')}</p>
              </Wrapper>
            </div>
          </QuestionHeader>
          <p className={'iu-mb-800'}>{question.answer.message}</p>
        </>
      )}
      {isAnsweredByCertificate(question) && getAnsweredByCertificate(question)}
    </Card>
  )
}

export default QuestionItem
