import type React from 'react'

interface Props {
  title: string
  description?: string
  footerMenu?: React.ReactNode
  mobileFooterMenu?: React.ReactNode
}

export const Footer = ({ title, description, footerMenu, mobileFooterMenu }: Props) => (
  <footer className="ic-page-footer">
    <div className="ic-page-footer__inner">
      <div className="iu-grid-cols-lg-5 ic-container--narrow-md ic-container iu-mb-500">
        <h2 className="ic-page-footer__heading iu-grid-span-lg-2">
          <span className="iu-color-white">{title}</span>
        </h2>
      </div>
      <div className="iu-grid-cols-lg-12 ic-container--narrow-md ic-container">
        <div className="iu-grid-span-lg-5 iu-color-white ic-text">
          <p>{description}</p>
        </div>
        <nav className="iu-grid iu-grid-span-lg-7 iu-grid-cols-3 iu-pl-xxl iu-hide-sm iu-hide-md" aria-label="Sidfot meny">
          {footerMenu}
        </nav>
      </div>
    </div>
    <div className="ic-page-footer__menu iu-hide-from-lg iu-bg-main">
      <nav className="ic-nav-list" id="mobile-nav" aria-label="Sidfot meny mobil">
        {mobileFooterMenu}
      </nav>
    </div>
  </footer>
)
