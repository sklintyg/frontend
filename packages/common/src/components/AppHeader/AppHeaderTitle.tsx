import React from 'react'
import styled from 'styled-components'

interface AppHeaderTitleProp {
  imgSrc: string
}

const Img = styled.img`
  filter: brightness(0) saturate(100%) invert(47%) sepia(70%) saturate(1013%) hue-rotate(141deg) brightness(86%) contrast(99%);
`

const AppHeaderTitle: React.FC<AppHeaderTitleProp> = ({ imgSrc }) => {
  return (
    <div className="ic-page-header__item ic-page-header__logo-container">
      <Img src={imgSrc} />
    </div>
  )
}

export default AppHeaderTitle
