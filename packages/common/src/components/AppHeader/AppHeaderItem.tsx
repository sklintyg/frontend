import React from 'react'
import { Box } from '@material-ui/core'

interface AppHeaderItemProps {
  children: React.ReactNode
}

const AppHeaderItem: React.FC<AppHeaderItemProps> = (props) => {
  return <Box marginLeft={5}>{props.children}</Box>
}

export default AppHeaderItem
