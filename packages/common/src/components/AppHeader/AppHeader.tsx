import React from 'react'

export interface AppHeaderProps {
  title: string
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

export default AppHeader
