import { houseImage } from '@frontend/common'
import React from 'react'
import AppHeaderImageWithText from './AppHeaderImageWithText'

interface Props {
  items: React.ReactNode
}

const AppHeaderUserUnit: React.FC<Props> = ({ items }) => {
  return <AppHeaderImageWithText items={items} image={houseImage} alt="Vald enhet"></AppHeaderImageWithText>
}

export default AppHeaderUserUnit
