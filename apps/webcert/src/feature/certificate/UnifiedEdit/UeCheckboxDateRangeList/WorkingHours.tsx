import styled from 'styled-components'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { questionImage } from '../../../../images'
import type { ValidationError } from '../../../../types'

const Icon = styled.img`
  width: 1rem;
  display: inline-block;
`

const tooltip = `Ange hur många timmar patienten arbetar i snitt per vecka. 
Maximal arbetstid som kan anges är 168 timmar per vecka. 
Observera att denna funktion endast är ett stöd för att 
tydliggöra hur många timmar per vecka patienten bedöms 
kunna arbeta när en viss nedsättning av arbetsförmåga 
har angivits. Uppgiften lagras inte som en del av intyget 
då Försäkringskassan inhämtar information från annat håll.`

export function WorkingHours({
  id,
  parent,
  disabled,
  baseWorkHours,
  onBaseWorkHours,
}: {
  id: string
  parent: string
  disabled: boolean
  baseWorkHours: string
  onBaseWorkHours: (data: string) => void
}) {
  const workingHoursError: ValidationError[] | null =
    parseInt(baseWorkHours) > 168
      ? [
          {
            category: parent,
            id,
            text: 'Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.',
            type: 'WORKING_HOURS_ERROR',
            field: 'WORKING_HOURS',
            showAlways: true,
          },
        ]
      : null

  return (
    <div>
      {!disabled && (
        <div className="iu-mb-400">
          <p className="iu-mb-200">
            Antalet timmar per vecka patienten arbetar i snitt{' '}
            <Icon src={questionImage} data-tooltip-id="tooltip" data-tooltip-content={tooltip} alt={tooltip} />
          </p>
          <TextInput
            onChange={(event) => onBaseWorkHours(event.target.value.replace(/[^0-9]/g, ''))}
            value={baseWorkHours}
            limit={3}
            style={{ width: '120px' }}
            hasValidationError={workingHoursError != null}
            data-testid="workingHours"
            onKeyDown={(event) => {
              if (event.key === ' ') {
                event.preventDefault()
              }
            }}
          />
          <QuestionValidationTexts validationErrors={workingHoursError ?? []} />
        </div>
      )}
    </div>
  )
}
