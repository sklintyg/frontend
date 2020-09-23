import React from 'react'
import { Box, Typography } from '@material-ui/core'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { User } from '../../types/user'
import { useSelector } from 'react-redux'
import { AppHeaderItem } from '../index'

export interface AppHeaderUserUnitProps {
  getUserSelector: () => User
}

const AppHeaderUserUnit: React.FC<AppHeaderUserUnitProps> = (props) => {
  let user: User | null = null

  user = useSelector(props.getUserSelector)

  return (
    <AppHeaderItem>
      <Box marginLeft={5} display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
        <Box clone marginRight={'10px'}>
          <ApartmentIcon />
        </Box>
        <Typography variant={'body1'} style={{ fontWeight: 'bold', marginRight: '5px' }}>
          test
        </Typography>
        <Typography variant={'body1'}>- test</Typography>
      </Box>
    </AppHeaderItem>
  )
}

export default AppHeaderUserUnit
