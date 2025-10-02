import AppHeaderImageWithText from './AppHeaderImageWithText'

interface Props {
  items: React.ReactNode
  image: string
}

const AppHeaderUser = ({ items, image }: Props) => {
  return <AppHeaderImageWithText items={items} image={image} alt="Inloggad användare"></AppHeaderImageWithText>
}

export default AppHeaderUser
