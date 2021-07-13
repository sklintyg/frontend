import React, { ChangeEvent, useRef, useState } from 'react'
import { Dropdown } from '@frontend/common'
import { CustomButton, QuestionSubject, TextArea } from '@frontend/common/src'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getQuestionDraft } from '../../store/question/questionSelectors'
import { deleteQuestion, saveQuestion, sendQuestion } from '../../store/question/questionActions'
import _ from 'lodash'

interface Props {}

const Wrapper = styled.div`
  padding: 10px;
`

const QuestionForm: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const questionDraft = useSelector(getQuestionDraft)
  const isFormEmpty = questionDraft.message === '' && questionDraft.subject === ''
  const [message, setMessage] = useState(questionDraft.message)
  const subjects: QuestionSubject[] = Object.values(QuestionSubject)

  const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const updatedQuestionDraft = { ...questionDraft, subject: event.currentTarget.value }
    dispatch(saveQuestion(updatedQuestionDraft))
  }

  const dispatchEditDraft = useRef(
    _.debounce((value: string) => {
      const updatedQuestionDraft = { ...questionDraft, message: value }
      dispatch(saveQuestion(updatedQuestionDraft))
    }, 1000)
  ).current

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatchEditDraft(event.currentTarget.value)
    setMessage(event.currentTarget.value)
  }

  const handleSendQuestion = () => {
    dispatch(sendQuestion(questionDraft))
  }

  const handleDeleteQuestion = () => {
    dispatch(deleteQuestion(questionDraft))
  }

  return (
    <div className="ic-forms__group iu-bg-white iu-m-300">
      <Wrapper>
        <div className="ic-forms__group">
          <Dropdown
            options={subjects.map((subject) => (
              <option key={subject} value={subject} label={subject.toString()} />
            ))}
            onChange={onDropdownChange}
            id={'question_form_dropdown'}
            value={questionDraft.subject}></Dropdown>
        </div>
        <div className="ic-forms__group">
          <TextArea value={message} onChange={onTextAreaChange}></TextArea>
        </div>
        <div className="ic-forms__group ic-button-group">
          <CustomButton disabled={isFormEmpty} style={'primary'} onClick={handleSendQuestion} text={'Skicka'}></CustomButton>
          <CustomButton disabled={isFormEmpty} style={'default'} onClick={handleDeleteQuestion} text={'Avbryt'}></CustomButton>
        </div>
      </Wrapper>
    </div>
  )
}

export default QuestionForm
