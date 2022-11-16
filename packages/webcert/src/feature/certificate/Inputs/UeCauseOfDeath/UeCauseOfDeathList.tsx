import {
  CertificateDataElement,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const Wrapper = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible === false ? 'none' : 'block')};
`

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config
  const questionValue = question.value
  const causes = (questionConfig as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [noVisible, setNoVisible] = useState(2)

  const addRowClick = () => {
    if (noVisible < causes.length) {
      setNoVisible(noVisible + 1)
    }
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
            const value: ValueCauseOfDeath = (questionValue as ValueCauseOfDeathList).list
              ? ((questionValue as ValueCauseOfDeathList).list.find((item) => item.id === cause.id) as ValueCauseOfDeath)
              : ({ id: cause.id } as ValueCauseOfDeath)

            if (value.description.text || value.debut.date || value.specification.code) {
              visible = true
            }

            return (
              <Wrapper visible={visible}>
                <UeCauseOfDeathControl
                  config={cause}
                  value={value}
                  key={index}
                  disabled={disabled}
                  hasValidationError={shouldDisplayValidationError}
                  question={question}
                />
              </Wrapper>
            )
          })}
      </div>
      <CustomButton
        disabled={noVisible >= causes.length}
        buttonStyle={'primary'}
        text="Lägg till ytterligare sjukdom"
        onClick={addRowClick}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

export default UeCauseOfDeathList
