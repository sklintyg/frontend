import { IDSHeader1177Admin, IDSHeader1177AdminItem, IDSHeader1177AdminMenuMobile, IDSHeader1177AdminNavItemMobile } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { AboutHeaderItem } from './AboutHeaderItem'
import { HeaderAvatarMenu } from './HeaderAvatarMenu'
import { LayoutHeaderNav } from './LayoutHeaderNav'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const name = `${user?.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`
  const unit = user?.valdVardenhet?.namn ?? ''

  const getAvatar = () => {
    if (isLoading) return undefined
    if (user) return <HeaderAvatarMenu name={name} unit={unit} />
    return (
      <IDSHeader1177AdminItem icon="user">
        <a href={config?.sithsIdpUrl}>Logga in</a>
      </IDSHeader1177AdminItem>
    )
  }

  const getMobileMenu = () => {
    if (!user) return <IDSHeader1177AdminMenuMobile />
    return (
      <IDSHeader1177AdminMenuMobile>
        <IDSHeader1177AdminNavItemMobile>
          <Link to="/">Översikt</Link>
        </IDSHeader1177AdminNavItemMobile>
        <IDSHeader1177AdminNavItemMobile>
          <Link to="/pagaende-sjukfall">Pågående sjukfall</Link>
        </IDSHeader1177AdminNavItemMobile>
        <IDSHeader1177AdminNavItemMobile>
          <Link to="/lakarutlatanden">Läkarutlåtanden</Link>
        </IDSHeader1177AdminNavItemMobile>
      </IDSHeader1177AdminMenuMobile>
    )
  }

  return (
    <IDSHeader1177Admin
      className="print:hidden"
      brandText="Rehabstöd"
      skipToContentLink={<a href="#content">Till sidans huvudinnehåll</a>}
      items={!isLoading && user ? <AboutHeaderItem /> : undefined}
      avatar={getAvatar()}
      mobileMenu={getMobileMenu()}
    >
      {user && <LayoutHeaderNav name={name} unit={unit} />}
    </IDSHeader1177Admin>
  )
}
