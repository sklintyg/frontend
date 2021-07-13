import React, { ChangeEvent } from 'react'
import { Dropdown } from '@frontend/common'
import { CustomButton, TextArea } from '@frontend/common/src'
import styled from 'styled-components'

interface Props {}

const Wrapper = styled.div`
  padding: 10px;
`

const QuestionForm: React.FC<Props> = () => {
  const [message, setMessage] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const isFormEmpty = (message === '' || message === undefined) && (subject === '' || subject === undefined)
  const isFormFilled = message !== '' && message !== undefined && subject !== '' && subject !== undefined

  const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSubject(event.currentTarget.value)
  }

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.currentTarget.value)
  }

  const sendQuestion = () => {
    if (isFormFilled) {
      // send question
    }
  }

  return (
    <div className="ic-forms__group iu-bg-white iu-m-300">
      <Wrapper>
        <div className="ic-forms__group">
          <Dropdown options={null} onChange={onDropdownChange} id={'question_form_dropdown'} value={subject}></Dropdown>
        </div>
        <div className="ic-forms__group">
          <TextArea value={message} onChange={onTextAreaChange}></TextArea>
        </div>
        <div className="ic-forms__group ic-button-group">
          <CustomButton disabled={isFormEmpty} style={'primary'} onClick={sendQuestion} text={'Skicka'}></CustomButton>
          <CustomButton disabled={isFormEmpty} style={'default'} onClick={sendQuestion} text={'Avbryt'}></CustomButton>
        </div>
      </Wrapper>
    </div>
  )
}

export default QuestionForm
