import { shallowEqual } from 'react-redux'
import DynamicLink from '../components/utils/DynamicLink'
import { useAppSelector } from '../store/store'
import { getDynamicLink } from '../store/utils/utilsSelectors'

interface Props {
  linkKey: string
  light?: boolean
}

const WCDynamicLink = ({ linkKey, light }: Props) => {
  const link = useAppSelector(getDynamicLink(linkKey), shallowEqual)

  return <DynamicLink link={link} light={light} />
}

export default WCDynamicLink
