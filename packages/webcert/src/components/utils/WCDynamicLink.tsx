import React from 'react'
import { useSelector } from 'react-redux'
import { getDynamicLink } from '@frontend/webcert/src/store/utils/utilsSelectors'
import DynamicLink from '@frontend/common/src/components/utils/DynamicLink'

interface Props {
  linkKey: string
}

const WCDynamicLink: React.FC<Props> = ({ linkKey }) => {
  const link = useSelector(getDynamicLink(linkKey))

  return <DynamicLink link={link} />
}

export default WCDynamicLink
