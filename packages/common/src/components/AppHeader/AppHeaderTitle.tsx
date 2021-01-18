import React from 'react'

interface AppHeaderTitleProp {
  imgSrc: string
}

const AppHeaderTitle: React.FC<AppHeaderTitleProp> = (props) => {
  return (
    <figure>
      <img src={props.imgSrc} alt="logo" />
    </figure>
  )
}

export default AppHeaderTitle
