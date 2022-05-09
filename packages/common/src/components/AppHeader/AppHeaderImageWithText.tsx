import React from 'react'
import styled from 'styled-components'

interface Props {
  items?: React.ReactNode
  image?: string
}

const Wrapper = styled.div`
  border-right: solid 1px #01a5a3;
  padding-right: 15px;
`

const Logo = styled.img`
  width: 30px;
  height: 30px;
`

const AppHeaderImageWithText: React.FC<Props> = ({ image, items }) => {
  return (
    <>
      <div role="presentation" className="iu-mr-300 iu-ml-400">
        <Logo src={image} className={'iu-mr-200'} />
      </div>
      <Wrapper className="iu-lh-narrow">
        <div className="">{items}</div>
      </Wrapper>
    </>
  )
}

export default AppHeaderImageWithText
