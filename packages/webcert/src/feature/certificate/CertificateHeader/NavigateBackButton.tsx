import { ResourceLinkType, StatusWithIcon } from '@frontend/common'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { getUserResourceLinks } from '../../../store/user/userSelectors'

const LinkButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: inherit;
`

const NavigateBackButton: React.FC = () => {
  const history = useHistory()
  const userLinks = useSelector(getUserResourceLinks)
  const navigateBackButton = userLinks?.find((link) => link.type === ResourceLinkType.NAVIGATE_BACK_BUTTON)
  return navigateBackButton && history.length > 0 ? (
    <StatusWithIcon icon="ArrowLeft">
      <LinkButton onClick={history.goBack}>{navigateBackButton.name}</LinkButton>
    </StatusWithIcon>
  ) : (
    <></>
  )
}

export default NavigateBackButton
