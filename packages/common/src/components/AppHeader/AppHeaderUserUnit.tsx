import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'
import unitImage from '../../images/house.svg'

interface Props {
  items: React.ReactNode
}

const AppHeaderUserUnit: React.FC<Props> = ({ items }) => {
  return <AppHeaderImageWithText items={items} image={unitImage} alt="Vald enhet"></AppHeaderImageWithText>
}

export default AppHeaderUserUnit
