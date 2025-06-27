import type React from 'react'
import styled from 'styled-components'
import { SrsInformationChoice } from '../../../types'
import { CustomButton } from '../../Inputs/CustomButton'

export const SRS_RECOMMENDATIONS_BUTTON_TEXT = 'Råd och åtgärder'
export const SRS_STATISTICS_BUTTON_TEXT = 'Nationell statistik'

const Root = styled.div`
  display: flex;
  justify-content: space-around;
`

const StyledButton = styled(CustomButton)`
  button {
    padding: 1rem 3rem !important;
  }
`

interface Props {
  onChange: (choice: SrsInformationChoice) => void
  currentChoice: SrsInformationChoice
}

const SrsInformationButton = ({
  text,
  choice,
  currentChoice,
  onChange,
}: Props & {
  text: string
  choice: SrsInformationChoice
}) => <StyledButton rounded text={text} onClick={() => onChange(choice)} buttonStyle={currentChoice === choice ? 'primary' : 'secondary'} />

const SrsInformationChoices = (props: Props) => (
  <Root className="iu-mb-300">
    <SrsInformationButton text={SRS_RECOMMENDATIONS_BUTTON_TEXT} choice={SrsInformationChoice.RECOMMENDATIONS} {...props} />
    <SrsInformationButton text={SRS_STATISTICS_BUTTON_TEXT} choice={SrsInformationChoice.STATISTICS} {...props} />
  </Root>
)

export default SrsInformationChoices
