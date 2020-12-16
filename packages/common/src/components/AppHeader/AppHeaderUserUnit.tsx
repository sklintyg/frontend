import React from 'react'
import { User } from '../../types/user'
import { AppHeaderItem } from '../index'

interface Props {
  user: User
}

const AppHeaderUserUnit: React.FC<Props> = ({ user }) => {
  return (
    <AppHeaderItem>
      <p>
        {user.loggedInCareProvider} - {user.loggedInUnit}
      </p>
    </AppHeaderItem>
  )
}

export default AppHeaderUserUnit
