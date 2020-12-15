import React from 'react'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { User } from '../../types/user'
import { AppHeaderItem } from '../index'

interface Props {
  user: User
}

const AppHeaderUserUnit: React.FC<Props> = ({ user }) => {
  return (
    <AppHeaderItem>
      <section>
        <div>
          <ApartmentIcon />
        </div>
        <p>{user.loggedInCareProvider}</p>
        <p>- {user.loggedInUnit}</p>
      </section>
    </AppHeaderItem>
  )
}

export default AppHeaderUserUnit
