import type { PlacesType } from 'react-tooltip'
import { Tooltip } from 'react-tooltip'
import styled from 'styled-components'

interface Props {
  placement?: PlacesType
}

const StyledTooltip = styled(Tooltip)`
  ul {
    text-align: left;
    margin: 0;
    padding: 0;
  }
`

const CustomTooltip = ({ placement }: Props) => {
  return (
    <StyledTooltip
      id="tooltip"
      role="tooltip"
      variant="light"
      place={placement ? placement : 'bottom'}
      className="ic-popover iu-fw-body ic-text"
    />
  )
}

export default CustomTooltip
