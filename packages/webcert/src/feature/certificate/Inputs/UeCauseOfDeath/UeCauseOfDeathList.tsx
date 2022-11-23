import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import trash from '@frontend/common/src/images/trash.svg'
import React, { useState, ComponentProps } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getFilter } from '../../../../components/icf/Styles'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import {
  getQuestionHasValidationError,
  getShowValidationErrors,
  getVisibleValidationErrors,
} from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

interface UeCauseOfDeathListProps {
  disabled: boolean
  question: CertificateDataElement
}

interface UeCauseOfDeathControlWrapperProps extends Omit<ComponentProps<typeof UeCauseOfDeathControl>, 'validationErrors'> {
  questionId: string
}

const DeleteButtonWrapper = styled.div`
  min-width: 10ch;
  padding-top: 1.46rem;
`

const ButtonIcon = styled.span`
  width: 22px;
  height: 22px;
  filter: ${() => getFilter('primary')};
`

const getValueList = (values: ValueCauseOfDeath[], config: ConfigureUeCauseOfDeathList): ValueCauseOfDeath[] => {
  return config.list.map((configItem, index) => {
    const value = values[index]
    return {
      id: configItem.id,
      description: {
        type: CertificateDataValueType.TEXT,
        id: configItem.descriptionId,
        text: value ? value.description.text : null,
      },
      debut: {
        type: CertificateDataValueType.DATE,
        id: configItem.debutId,
        date: value ? value.debut.date : undefined,
      },
      specification: value
        ? value.specification
        : {
            id: configItem.id,
            type: CertificateDataValueType.CODE,
            code: '',
          },
      type: CertificateDataValueType.CAUSE_OF_DEATH,
    }
  })
}

const UeCauseOfDeathControlWrapper: React.FC<UeCauseOfDeathControlWrapperProps> = ({ children, questionId, ...args }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(questionId, args.config.id))
  return (
    <UeCauseOfDeathControl {...args} validationErrors={validationErrors}>
      {children}
    </UeCauseOfDeathControl>
  )
}

const UeCauseOfDeathList: React.FC<UeCauseOfDeathListProps> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigureUeCauseOfDeathList
  const questionValue = question.value as ValueCauseOfDeathList
  const questionValueList = getValueList(questionValue.list, questionConfig)
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const dispatch = useAppDispatch()
  const [numVisible, setNumVisible] = useState(
    questionValueList.reduce((result, item, index) => {
      return index > 1 && (item.description.text || item.debut.date || item.specification.code) ? result + 1 : result
    }, 2)
  )

  const addRowClick = () => {
    if (numVisible < questionConfig.list.length) {
      setNumVisible((val) => val + 1)
    }
  }

  const handleDeleteRow = (id: string) => {
    dispatchChanges(
      getValueList(
        questionValueList.filter((item) => item.id !== id),
        questionConfig
      )
    )

    setNumVisible((val) => Math.max(val - 1, 2))
  }

  const handleChange = (value: ValueCauseOfDeath) => {
    dispatchChanges(
      getValueList(
        questionValueList.map((item) => (item.id === value.id ? value : item)),
        questionConfig
      )
    )
  }

  const dispatchChanges = (list: ValueCauseOfDeath[]) => {
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: {
          ...questionValue,
          list,
        },
      })
    )
  }

  return (
    <>
      <div>
        {questionValueList
          .filter((_item, index) => index < numVisible)
          .map((value, index) => {
            const config = questionConfig.list.find((item) => item.id === value.id)

            return (
              config && (
                <UeCauseOfDeathControlWrapper
                  questionId={question.id}
                  id={value.id}
                  config={config}
                  value={value}
                  key={index}
                  disabled={disabled}
                  hasValidationError={shouldDisplayValidationError}
                  oneLine={true}
                  validation={question.validation}
                  onChange={handleChange}>
                  <DeleteButtonWrapper className="iu-ml-500">
                    {index > 0 && (
                      <CustomButton disabled={disabled} buttonStyle="secondary" onClick={() => handleDeleteRow(config.id)} height="47px">
                        <ButtonIcon>
                          <img src={trash} alt="Radera rad" />
                        </ButtonIcon>
                      </CustomButton>
                    )}
                  </DeleteButtonWrapper>
                </UeCauseOfDeathControlWrapper>
              )
            )
          })}
      </div>
      <CustomButton
        disabled={disabled || numVisible >= questionConfig.list.length}
        buttonStyle={'primary'}
        text="Lägg till ytterligare sjukdom"
        onClick={addRowClick}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </>
  )
}

export default UeCauseOfDeathList
