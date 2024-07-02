import type React from 'react'
import styled from 'styled-components'

interface Props {
  items?: React.ReactNode
  image?: string
  alt?: string
}

const Wrapper = styled.div`
  display: flex;
  border-right: solid 1px #01a5a3;
  align-items: center;
  padding-right: 15px;
`

const Logo = styled.img`
  width: 30px;
  height: 30px;
`

const LogoWrapper = styled.div`
  flex-shrink: 0;
`

const AppHeaderImageWithText: React.FC<Props> = ({ image, items, alt }) => {
  return (
    <Wrapper>
      <LogoWrapper className="iu-mr-300 iu-ml-400">
        <Logo src={image} className={'iu-mr-200'} alt={alt} />
      </LogoWrapper>
      <div className="iu-lh-narrow">
        <div className="">{items}</div>
      </div>
    </Wrapper>
  )
}

export default AppHeaderImageWithText
