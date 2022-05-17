import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'
import userImage from '../../images/user-image.svg'

interface Props {
  items: React.ReactNode
}

const AppHeaderUser: React.FC<Props> = ({ items }) => {
  return <AppHeaderImageWithText items={items} image={userImage} alt="Inloggad användare"></AppHeaderImageWithText>
}

export default AppHeaderUser
