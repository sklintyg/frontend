import styled from 'styled-components'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import Accordion from '../../../../components/utils/Accordion'
import AccordionHeader from '../../../../components/utils/AccordionHeader'
import { Text } from '../../../../components/utils/Text'
import { ValidationError } from '../../../../types'
import { WorkingHoursInput } from './WorkingHoursInput'

const AccodrionWrapper = styled.div`
  flex: 0 0 100%;
`

const DaysRangeWrapper = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 0.5rem;
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`

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
        <>
          <DaysRangeWrapper>
            <AccodrionWrapper>
              <Accordion>
                <AccordionHeader>
                  <WorkingHoursInput
                    onChange={(event) => onBaseWorkHours(event.target.value.replace(/[^0-9]/g, ''))}
                    value={baseWorkHours}
                    hasValidationError={workingHoursError != null}
                  />
                </AccordionHeader>
                <Text className="iu-mb-400">
                  Ange hur många timmar patienten arbetar i snitt per vecka. Maximal arbetstid som kan anges är 168 timmar per vecka.
                  Observera att denna funktion endast är ett stöd för att tydliggöra hur många timmar per vecka patienten bedöms kunna
                  arbeta när en viss nedsättning av arbetsförmåga har angivits. Uppgiften lagras inte som en del av intyget då
                  Försäkringskassan inhämtar information från annat håll.
                </Text>
              </Accordion>
            </AccodrionWrapper>
          </DaysRangeWrapper>
          <QuestionValidationTexts validationErrors={workingHoursError ?? []} />
        </>
      )}
    </div>
  )
}
