import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  formatDateToString,
  getValidDate,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import trash from '@frontend/common/src/images/trash.svg'
import { isValid } from 'date-fns'
import { merge } from 'lodash'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getFilter } from '../../../../components/icf/Styles'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getShowValidationErrors, getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

interface Props {
  disabled: boolean
  question: CertificateDataElement
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
    const value: ValueCauseOfDeath = values[index]
    return {
      id: configItem.id,
      description: merge(
        {
          type: CertificateDataValueType.TEXT,
          id: configItem.descriptionId,
        },
        value && { text: value.description.text }
      ),
      debut: merge(
        {
          type: CertificateDataValueType.DATE,
          id: configItem.debutId,
        },
        value && { date: value.debut.date }
      ),
      specification: {
        id: configItem.id,
        type: CertificateDataValueType.CODE,
        code: value?.specification?.code ?? null,
      },
      type: CertificateDataValueType.CAUSE_OF_DEATH,
    }
  })
}

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigureUeCauseOfDeathList
  const questionValue = question.value as ValueCauseOfDeathList
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const dispatch = useAppDispatch()
  const [questionValueList, setQuestionValueList] = useState(getValueList(questionValue.list, questionConfig))
  const [numVisible, setNumVisible] = useState(
    questionValueList.reduce((result, item, index) => {
      return index > 0 && (item.description.text || item.debut.date || item.specification.code) ? index + 1 : result
    }, 1)
  )

  const addRowClick = () => {
    if (numVisible < questionConfig.list.length) {
      setNumVisible((val) => val + 1)
    }
  }

  const handleDeleteRow = (id: string) => {
    updateList(questionValueList.filter((item) => item.id !== id))
    setNumVisible((val) => Math.max(val - 1, 1))
  }

  const handleChange = (value: ValueCauseOfDeath) => {
    updateList(questionValueList.map((item) => (item.id === value.id ? value : item)))
  }

  const updateList = (list: ValueCauseOfDeath[]) => {
    setQuestionValueList(getValueList(list, questionConfig))

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: {
          ...questionValue,
          list: list.map(({ debut, ...val }) => {
            const date = getValidDate(debut.date)
            return { ...val, debut: { ...debut, date: date && isValid(date) ? formatDateToString(date) : '' } }
          }),
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
                <UeCauseOfDeathControl
                  questionId={question.id}
                  config={config}
                  value={value}
                  key={config.id}
                  disabled={disabled}
                  isShowValidationError={isShowValidationError}
                  oneLine={true}
                  validation={question.validation}
                  onChange={handleChange}
                  validationErrors={validationErrors.filter((v) => v.field.includes(`[${index}]`))}>
                  <DeleteButtonWrapper className="iu-ml-500">
                    {index > 0 && (
                      <CustomButton disabled={disabled} buttonStyle="secondary" onClick={() => handleDeleteRow(config.id)} height="47px">
                        <ButtonIcon>
                          <img src={trash} alt="Radera rad" />
                        </ButtonIcon>
                      </CustomButton>
                    )}
                  </DeleteButtonWrapper>
                </UeCauseOfDeathControl>
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
    </>
  )
}

export default UeCauseOfDeathList
