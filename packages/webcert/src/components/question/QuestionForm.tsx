import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Dropdown, Question } from '@frontend/common'
import { CustomButton, QuestionType, TextArea } from '@frontend/common/src'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { deleteQuestion, saveQuestion, sendQuestion } from '../../store/question/questionActions'
import _ from 'lodash'

interface Props {
  questionDraft: Question
}

const Wrapper = styled.div`
  padding: 10px;
`

const QuestionForm: React.FC<Props> = ({ questionDraft }) => {
  const dispatch = useDispatch()
  const isFormEmpty = questionDraft.message === '' && questionDraft.type === QuestionType.DEFAULT
  const [message, setMessage] = useState(questionDraft.message)
  const subjects: QuestionType[] = Object.values(QuestionType)

  useEffect(() => {
    setMessage(questionDraft.message)
  }, [questionDraft.message])

  const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const updatedQuestionDraft: Question = { ...questionDraft, type: event.currentTarget.value as QuestionType }
    dispatch(saveQuestion(updatedQuestionDraft))
  }

  const dispatchEditDraft = useRef(
    _.debounce((questionDraft: Question, value: string) => {
      const updatedQuestionDraft = { ...questionDraft, message: value }
      dispatch(saveQuestion(updatedQuestionDraft))
    }, 1000)
  ).current

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatchEditDraft(questionDraft, event.currentTarget.value)
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
      case QuestionType.DEFAULT:
        return 'Välj typ av fråga'
      case QuestionType.COORDINATION:
        return 'Avstämningsmöte'
      case QuestionType.CONTACT:
        return 'Kontakt'
      case QuestionType.OTHER:
        return 'Övrigt'
    }
  }

  return (
    <div className="ic-forms__group iu-bg-white iu-m-300">
      <Wrapper>
        <h5>Här kan du ställa en ny fråga till Försäkringskassan.</h5>
        <div className="ic-forms__group">
          <Dropdown
            options={subjects.map((subject) => (
              <option key={subject} value={subject} label={getQuestionTypeName(subject)} />
            ))}
            onChange={onDropdownChange}
            id={'question_form_dropdown'}
            value={questionDraft.type}></Dropdown>
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
