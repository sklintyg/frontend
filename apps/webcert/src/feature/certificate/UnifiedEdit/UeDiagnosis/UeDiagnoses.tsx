import { useState } from 'react'
import styled from 'styled-components'
import RadioButton from '../../../../components/Inputs/RadioButton'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { CertificateDataElement, ConfigUeDiagnoses, ValueDiagnosisList } from '../../../../types'
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
            {questionConfig.terminology.map((terminology) => {
              return (
                <RadioButton
                  key={terminology.id}
                  disabled={disabled}
                  label={terminology.label}
                  name={terminology.id}
                  id={terminology.id}
                  value={terminology.id}
                  checked={selectedCodeSystem === terminology.id}
                  onChange={handleCodeSystemChange}
                />
              )
            })}
          </RadioWrapper>
        </>
      )}
      <p className={'iu-mb-200'}>
        Diagnoskod enligt {questionConfig.terminology.find((terminilogy) => terminilogy.id === selectedCodeSystem)?.label}
      </p>
      <div>
        {questionConfig.list.map((diagnosis, index) => {
          const diagnosisValidationErrors = validationErrors.filter((validation) => validation.field === diagnosis.id)
          return (
            <UeDiagnosis
              hasValidationError={(index === 0 && validationErrors.length === 1) || diagnosisValidationErrors.length > 0}
              key={`${diagnosis.id}-diagnosis`}
              question={question}
              disabled={disabled}
              id={diagnosis.id}
              selectedCodeSystem={selectedCodeSystem}
              validationErrors={diagnosisValidationErrors}
            />
          )
        })}
      </div>
      {validationErrors.length === 1 && (
        <QuestionValidationTexts validationErrors={validationErrors.filter((error) => !fields.includes(error.field))} />
      )}
    </>
  )
}

export default UeDiagnoses
