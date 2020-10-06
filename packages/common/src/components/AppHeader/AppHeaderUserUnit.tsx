import React from 'react'
import { Box, Typography } from '@material-ui/core'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { User } from '../../types/user'
import { AppHeaderItem } from '../index'

interface Props {
  user: User
}

const AppHeaderUserUnit: React.FC<Props> = ({ user }) => {
  return (
    <AppHeaderItem>
      <Box marginLeft={5} display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
        <Box clone marginRight={'10px'}>
          <ApartmentIcon />
        </Box>
        <Typography variant={'body1'} style={{ fontWeight: 'bold', marginRight: '5px' }}>
          {user.loggedInCareProvider}
        </Typography>
        <Typography variant={'body1'}>- {user.loggedInUnit}</Typography>
      </Box>
    </AppHeaderItem>
  )
}

export default AppHeaderUserUnit
