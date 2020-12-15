import React from 'react'
import PersonIcon from '@material-ui/icons/Person'
import { User } from '../../types/user'
import { AppHeaderItem } from '../index'

interface Props {
  user: User
}

const AppHeaderUser: React.FC<Props> = ({ user }) => {
  return (
    <AppHeaderItem>
      <div>
        <div>
          <PersonIcon />
        </div>
        <p>{user.name}</p>
        <p>- {user.role}</p>
      </div>
    </AppHeaderItem>
  )
}

export default AppHeaderUser
