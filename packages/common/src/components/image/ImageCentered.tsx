import React from 'react'
import styled from 'styled-components'

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

interface Props {
  imgSrc: string
  alt: string
}

const ImageCentered: React.FC<Props> = ({ imgSrc, alt, children }) => {
  return (
    <EmptyWrapper>
      <img className={'iu-mt-600 iu-mb-300'} src={imgSrc} alt={alt} />
      {children}
    </EmptyWrapper>
  )
}

export default ImageCentered
