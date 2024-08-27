import { useState } from 'react'
import styled from 'styled-components'
import RadioButton from '../../../../components/Inputs/RadioButton'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeDiagnoses, ValueDiagnosisList } from '../../../../types'
import UeDiagnosis from './UeDiagnosis'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.9375rem;

  div {
    padding-right: 0.9375rem;
  }
`

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDiagnoses: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeDiagnoses
  const questionValue = question.value as ValueDiagnosisList
  const firstSavedItem = questionValue.list.find((value) => value && value.terminology !== '')
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(
    questionValue.list.length > 0 && firstSavedItem ? firstSavedItem.terminology : questionConfig.terminology[0].id
  )
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))
  const fields = questionConfig.list.map((diagnosis) => diagnosis.id)
  const validationErrorsWithMissingField = validationErrors.filter(({ field }) => !fields.includes(field))
  const dispatch = useAppDispatch()

  const handleCodeSystemChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, list: [] } }))
    setSelectedCodeSystem(event.currentTarget.name)
  }

  return (
    <>
      {questionConfig.terminology.length > 1 && (
        <>
          <p>Välj kodverk:</p>
          <RadioWrapper>
            {questionConfig.terminology.map(({ id, label }) => {
              return (
                <RadioButton
                  key={id}
                  disabled={disabled}
                  label={label}
                  name={id}
                  id={id}
                  value={id}
                  checked={selectedCodeSystem === id}
                  onChange={handleCodeSystemChange}
                />
              )
            })}
          </RadioWrapper>
        </>
      )}
      <p className={'iu-mb-200'}>Diagnoskod enligt {questionConfig.terminology.find(({ id }) => id === selectedCodeSystem)?.label}</p>
      <div>
        {questionConfig.list.map(({ id }, index) => {
          const diagnosisValidationErrors = validationErrors.filter(({ field }) => field === id)
          return (
            <UeDiagnosis
              hasValidationError={(index === 0 && validationErrorsWithMissingField.length > 0) || diagnosisValidationErrors.length > 0}
              key={`${id}-diagnosis`}
              question={question}
              disabled={disabled}
              id={id}
              selectedCodeSystem={selectedCodeSystem}
              validationErrors={diagnosisValidationErrors}
            />
          )
        })}
      </div>
      {validationErrorsWithMissingField.length > 0 && <QuestionValidationTexts validationErrors={validationErrorsWithMissingField} />}
    </>
  )
}

export default UeDiagnoses
