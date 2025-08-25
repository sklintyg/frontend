import { merge } from 'lodash-es'
import { useState } from 'react'
import styled from 'styled-components'
import { CustomButton } from '../../../../components/Inputs/CustomButton'
import { addCircleImage, removeCircleImage } from '../../../../images'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import type {
  CertificateDataElement,
  ConfigUeCauseOfDeathList,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueDate,
  ValueText,
} from '../../../../types'
import { CertificateDataValueType } from '../../../../types'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const DeleteButtonWrapper = styled.div`
  min-width: 116.17px;
  padding-top: 1.46rem;
`

const getValueList = (values: ValueCauseOfDeath[], config: ConfigUeCauseOfDeathList): ValueCauseOfDeath[] => {
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
      ) as ValueText,
      debut: merge(
        {
          type: CertificateDataValueType.DATE,
          id: configItem.debutId,
        },
        value && { date: value.debut.date }
      ) as ValueDate,
      specification: {
        id: configItem.id,
        type: CertificateDataValueType.CODE,
        code: value?.specification?.code ?? undefined,
      },
      type: CertificateDataValueType.CAUSE_OF_DEATH,
    }
  })
}

const UeCauseOfDeathList = ({ question, disabled }: Props) => {
  const questionConfig = question.config as ConfigUeCauseOfDeathList
  const questionValue = question.value as ValueCauseOfDeathList
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))
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
                <UeCauseOfDeathControl
                  config={config}
                  value={value}
                  key={config.id}
                  disabled={disabled}
                  oneLine={true}
                  validation={question.validation}
                  onChange={handleChange}
                  validationErrors={validationErrors.filter((v) => v.field.includes(`[${index}]`))}
                >
                  <DeleteButtonWrapper className="iu-ml-500">
                    {index > 0 && (
                      <CustomButton
                        disabled={disabled}
                        buttonStyle="secondary"
                        onClick={() => handleDeleteRow(config.id)}
                        text="Ta bort"
                        startIcon={<img src={removeCircleImage} alt="Radera rad" />}
                        inline={true}
                      />
                    )}
                  </DeleteButtonWrapper>
                </UeCauseOfDeathControl>
              )
            )
          })}
      </div>
      <CustomButton
        disabled={disabled || numVisible >= questionConfig.list.length}
        buttonStyle="secondary"
        text="Lägg till sjukdom/skada"
        onClick={addRowClick}
        startIcon={<img src={addCircleImage} alt="Lägg till rad" />}
      />
    </>
  )
}

export default UeCauseOfDeathList
