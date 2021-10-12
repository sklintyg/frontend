import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'
import userImage from '../../images/user-image.svg'

interface Props {
  items: React.ReactNode
}

const AppHeaderUser: React.FC<Props> = ({ items }) => {
  return <AppHeaderImageWithText items={items} image={userImage}></AppHeaderImageWithText>
}

export default AppHeaderUser
