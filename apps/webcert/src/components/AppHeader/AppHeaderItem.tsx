import React from 'react'

interface AppHeaderItemProps {
  children: React.ReactNode
}

const AppHeaderItem: React.FC<AppHeaderItemProps> = (props) => {
  return <div>{props.children}</div>
}

export default AppHeaderItem
