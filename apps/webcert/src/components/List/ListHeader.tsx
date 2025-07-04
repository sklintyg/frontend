import styled from 'styled-components'
import { BoxShadowContainer } from '../../styles/styledComponents'

const Wrapper = styled.div`
  align-items: center;
`

interface Props {
  title: string
  description: string
  icon: string
}

const ListHeader = ({ title, description, icon }: Props) => {
  return (
    <BoxShadowContainer>
      <div className="ic-container iu-py-300">
        <Wrapper className="iu-flex">
          <img src={icon} className="iu-mr-gutter iu-height-600" alt="icon" />
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </Wrapper>
      </div>
    </BoxShadowContainer>
  )
}

export default ListHeader
