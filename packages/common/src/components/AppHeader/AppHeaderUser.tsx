import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'

interface Props {
  items: React.ReactNode
  image: string
}

const AppHeaderUser: React.FC<Props> = ({ items, image }) => {
  return <AppHeaderImageWithText items={items} image={image} alt="Inloggad användare"></AppHeaderImageWithText>
}

export default AppHeaderUser
