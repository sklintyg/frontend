import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'
import userImage from '../../images/user-image.svg'

interface Props {
  text: React.ReactNode
}

const AppHeaderUser: React.FC<Props> = ({ text }) => {
  return <AppHeaderImageWithText items={text} image={userImage}></AppHeaderImageWithText>
}

export default AppHeaderUser
