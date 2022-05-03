import React from 'react'
import styled from 'styled-components'

interface Props {
  items?: React.ReactNode
  image?: string
  alt?: string
}

const Wrapper = styled.div`
  border-right: solid 1px #01a5a3;
  padding-right: 15px;
`

const AppHeaderImageWithText: React.FC<Props> = ({ image, items, alt }) => {
  return (
    <>
      <div role="presentation" className="iu-mr-300 iu-ml-400">
        <img src={image} className={'iu-mr-200'} alt={alt} />
      </div>
      <Wrapper className="iu-lh-narrow">
        <div className="">{items}</div>
      </Wrapper>
    </>
  )
}

export default AppHeaderImageWithText
