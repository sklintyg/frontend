import React from 'react'
import { AppHeaderItem } from '../index'

interface Props {
  text: string
}

const AppHeaderUser: React.FC<Props> = ({ text }) => {
  return (
    <AppHeaderItem>
      <p>{text}</p>
    </AppHeaderItem>
  )
}

export default AppHeaderUser
