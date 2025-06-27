import styled from 'styled-components'

const Wrapper = styled.span`
  min-width: 10px;
  padding: 3px 7px !important;
  white-space: nowrap;
  text-align: center;
  border-radius: 20px;
  margin-left: 8px;
`

interface Props {
  number: number | string
  type: 'primary' | 'secondary'
  className?: string
}

export const NumberCircle = ({ number, type, className }: Props) => {
  return (
    <Wrapper className={`${className} ${type === 'secondary' ? 'ic-button iu-bg-main iu-color-white' : 'iu-bg-white iu-color-main'}`}>
      {number}
    </Wrapper>
  )
}
