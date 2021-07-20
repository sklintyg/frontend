import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Answer,
  ButtonWithConfirmModal,
  Checkbox,
  CustomButton,
  getResourceLink,
  Question,
  ResourceLinkType,
  StatusWithIcon,
  TextArea,
} from '@frontend/common'
import { format } from 'date-fns'
import fkImg from './fk.png'
import userImage from '../../images/user-image.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAnswer,
  deleteAnswer,
  editAnswer,
  handleQuestion,
  sendAnswer,
  updateAnswerDraftSaved,
} from '../../store/question/questionActions'
import _ from 'lodash'
import { isAnswerDraftSaved } from '../../store/question/questionSelectors'

// TODO: Replace color with var(--color-grey-400)
const QuestionHeader = styled.div`
  border-bottom: 1px solid #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Card = styled.div`
  margin: 10px 0 10px 0;
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

  const isAnswerButtonVisible = () => !question.answer && getResourceLink(question.links, ResourceLinkType.ANSWER_QUESTION)?.enabled

  const isHandleCheckboxVisible = () => getResourceLink(question.links, ResourceLinkType.HANDLE_QUESTION)?.enabled

  return (
    <Card className={'ic-card'}>
      <QuestionHeader>
        <img src={getImageSrc(question.author)} className={'iu-mr-200'} />
        <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
          <Wrapper>
            <p className={'iu-fw-heading'}>{question.author}</p>
            {isHandleCheckboxVisible() && (
              <Checkbox
                id={'hanterad' + question.id}
                label="Hanterad"
                value="hanterad"
                checked={question.handled}
                vertical={true}
                disabled={false}
                onChange={handleChange}
              />
            )}
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
      <p className={'iu-mb-800'}>{question.message}</p>
      {isAnswerButtonVisible() && (
        <CustomButton style={'primary'} onClick={handleCreateAnswer} text={'Svara'} tooltipClassName={'iu-ml-none'} />
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
                style={'primary'}
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
            <img src={getImageSrc(question.answer.author)} className={'iu-mr-200'} />
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
    </Card>
  )
}

export default QuestionItem
