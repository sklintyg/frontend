import React from 'react'
import ReactTooltip, { Place } from 'react-tooltip'

interface Props {
  placement?: Place
}

const CustomTooltip: React.FC<Props> = ({ placement }) => {
  return <ReactTooltip type={'light'} effect={'solid'} place={placement ? placement : 'bottom'} className={'ic-popover iu-fw-body'} />
}

export default CustomTooltip
