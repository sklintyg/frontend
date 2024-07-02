import type React from 'react'
import type { Place } from 'react-tooltip';
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

interface Props {
  placement?: Place
}

const Wrapper = styled.div`
  ul {
    text-align: left;
    margin: 0;
    padding: 0;
  }
`

const CustomTooltip: React.FC<Props> = ({ placement }) => {
  return (
    <Wrapper>
      <ReactTooltip
        role={'tooltip'}
        type={'light'}
        effect={'solid'}
        place={placement ? placement : 'bottom'}
        className={'ic-popover iu-fw-body ic-text'}
      />
    </Wrapper>
  )
}

export default CustomTooltip
