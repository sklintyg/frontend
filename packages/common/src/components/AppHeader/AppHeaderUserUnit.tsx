import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'
import unitImage from '../../images/unit-image.svg'

interface Props {
  items: React.ReactNode
}

const AppHeaderUserUnit: React.FC<Props> = ({ items }) => {
  return <AppHeaderImageWithText items={items} image={unitImage}></AppHeaderImageWithText>
}

export default AppHeaderUserUnit
