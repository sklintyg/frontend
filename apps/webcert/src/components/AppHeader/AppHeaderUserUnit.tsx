import { houseImage } from '../../images'
import AppHeaderImageWithText from './AppHeaderImageWithText'

interface Props {
  items: React.ReactNode
}

const AppHeaderUserUnit = ({ items }: Props) => {
  return <AppHeaderImageWithText items={items} image={houseImage} alt="Vald enhet"></AppHeaderImageWithText>
}

export default AppHeaderUserUnit
