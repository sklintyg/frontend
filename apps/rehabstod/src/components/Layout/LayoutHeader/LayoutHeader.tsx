import '@inera/ids-design/components/header-1177-admin/header-1177-admin-avatar-mobile.css'
import '@inera/ids-design/components/header-1177-admin/header-1177-admin-avatar.css'
import '@inera/ids-design/components/header-1177-admin/header-1177-admin-item.css'
import '@inera/ids-design/components/header-1177-admin/header-1177-admin-nav-item.css'
import '@inera/ids-design/components/header-1177-admin/header-1177-admin-nav.css'
import '@inera/ids-design/components/header-1177-admin/header-1177-admin.css'
import { Link } from 'react-router-dom'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { AboutHeaderItem } from './AboutHeaderItem'
import { HeaderAvatarMenu } from './HeaderAvatarMenu'
import { LayoutMobileMenu } from './LayoutMobileMenu/LayoutMobileMenu'
import { HeaderNavItem } from './NavItem/HeaderNavItem'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const name = `${user?.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`
  const unit = user?.valdVardenhet?.namn ?? ''

  return (
    <header className="ids-header-1177-admin print:hidden">
      <div className="ids-header-1177-admin__container">
        <div className="ids-header-1177-admin__inner">
          <div className="ids-header-1177-admin__logo-col">
            <div className="ids-header-1177-admin__logo">
              <Link to="/" className="ids-header-1177-admin__logo-link" aria-label="Logotyp" />
            </div>
            <div className="ids-header-1177-admin__brand">
              <div className="ids-header-1177-admin__brand-text">Rehabstöd</div>
            </div>
          </div>

          <div className="ids-header-1177-admin__items">
            <div className="ids-header-1177-admin__items-inner">
              {!isLoading && user && (
                <>
                  <AboutHeaderItem />

                  <HeaderAvatarMenu name={name} unit={unit} />

                  <div className="ids-header-1177-admin__mobile-menu">
                    <button type="button" aria-label="Meny" className="ids-header-1177-admin__mobile-menu__btn" aria-expanded="true">
                      <div className="ids-hamburger">
                        <div className="ids-hamburger__lines" />
                      </div>
                    </button>
                  </div>
                </>
              )}

              {!isLoading && !user && (
                <a
                  href={config && config.sithsIdpUrl}
                  className="ids-header-1177-admin__items__item ids-header-1177-admin__items__item--mobile"
                >
                  <div className="ids-header-1177-admin__items__item-icon">
                    <span className="ids-icon-user" />
                  </div>
                  <div className="ids-header-1177-admin__items__item-text">Logga in</div>
                </a>
              )}
            </div>
          </div>
        </div>

        {user && (
          <nav className="ids-header-1177-admin__nav">
            <ul className="ids-header-1177-admin__nav-inner">
              <HeaderNavItem title="Översikt" to="/" />
              <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
              <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
            </ul>
          </nav>
        )}
      </div>
      <LayoutMobileMenu name={name} unit={unit} />
    </header>
  )
}
