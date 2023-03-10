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

const SrsInformationChoices: React.FC<Props> = ({ onChange, currentChoice }) => {
  const handleOnChange = (choice: SrsInformationChoice) => {
    onChange(choice)
  }

  const getStyling = (choice: SrsInformationChoice) => {
    return currentChoice === choice ? 'primary' : 'secondary'
  }

  const getButton = (choice: SrsInformationChoice, text: string) => {
    return <StyledButton rounded text={text} onClick={() => handleOnChange(choice)} buttonStyle={getStyling(choice)} />
  }

  return (
    <Root className="iu-mb-300">
      {getButton(SrsInformationChoice.RECOMMENDATIONS, SRS_RECOMMENDATIONS_BUTTON_TEXT)}
      {getButton(SrsInformationChoice.STATISTICS, SRS_STATISTICS_BUTTON_TEXT)}
    </Root>
  )
}

export default SrsInformationChoices
