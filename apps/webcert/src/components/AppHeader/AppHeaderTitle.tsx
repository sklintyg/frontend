import type React from 'react'
import styled from 'styled-components'

interface AppHeaderTitleProp {
  imgSrc: string
  alt?: string
}

// To change color: https://codepen.io/sosuke/pen/Pjoqqp
const Img = styled.img`
  filter: brightness(0) invert(16%) sepia(52%) saturate(6486%) hue-rotate(172deg) brightness(98%) contrast(100%);
`

const AppHeaderTitle = ({ imgSrc, alt }: AppHeaderTitleProp) => {
  return (
    <div className="ic-page-header__item ic-page-header__logo-container">
      <Img src={imgSrc} alt={alt} />
    </div>
  )
}

export default AppHeaderTitle
