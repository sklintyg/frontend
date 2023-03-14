import React from 'react'
import styled from 'styled-components'

const Image = styled.img`
  max-width: 130px;
  padding-top: 24px;
  padding-bottom: 8px;
`

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface Props {
  imgSrc: string | undefined
}

const CenteredImageWithContent: React.FC<Props> = ({ children, imgSrc }) => {
  return (
    <div className={'iu-flex iu-flex-center'}>
      <Figure>
        <Image src={imgSrc} />
        {children}
      </Figure>
    </div>
  )
}

export default CenteredImageWithContent
