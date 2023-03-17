import React from 'react'
import { CustomButton, SrsInformationChoice } from '@frontend/common'
import styled from 'styled-components'

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

const SrsInformationButton: React.FC<Props & {
  text: string
  choice: SrsInformationChoice
}> = ({ text, choice, currentChoice, onChange }) => (
  <StyledButton rounded text={text} onClick={() => onChange(choice)} buttonStyle={currentChoice === choice ? 'primary' : 'secondary'} />
)

const SrsInformationChoices: React.FC<Props> = (props) => (
  <Root className="iu-mb-300">
    <SrsInformationButton text={SRS_RECOMMENDATIONS_BUTTON_TEXT} choice={SrsInformationChoice.RECOMMENDATIONS} {...props} />
    <SrsInformationButton text={SRS_STATISTICS_BUTTON_TEXT} choice={SrsInformationChoice.STATISTICS} {...props} />
  </Root>
)

export default SrsInformationChoices
