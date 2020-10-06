import React from 'react'
import { Box, CircularProgress, Typography } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import { User } from '../../types/user'
import { useSelector } from 'react-redux'
import { AppHeaderItem } from '../index'

interface Props {
  getUserSelector: (state: any) => User | null
}

const AppHeaderUser: React.FC<Props> = ({ getUserSelector }) => {
  const user = useSelector(getUserSelector)

  if (!user) return null

  return (
    <AppHeaderItem>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box clone marginRight={'10px'}>
          <PersonIcon />
        </Box>
        <Typography variant={'body1'} style={{ fontWeight: 'bold', marginRight: '5px' }}>
          {user.name}
        </Typography>
        <Typography variant={'body1'}>- {user.title}</Typography>
      </Box>
    </AppHeaderItem>
  )
}

export default AppHeaderUser
