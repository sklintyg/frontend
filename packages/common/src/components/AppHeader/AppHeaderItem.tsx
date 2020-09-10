import React from 'react'
import { Box, Typography } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'

export interface AppHeaderItemProps {
  children: React.ReactNode
}

const AppHeaderItem: React.FC<AppHeaderItemProps> = (props) => {
  return <Box marginLeft={5}>{props.children}</Box>
}

export default AppHeaderItem
