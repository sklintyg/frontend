import React from 'react'

export const Footer: React.FC = () => (
  <footer className="ic-page-footer">
    <div className="ic-page-footer__inner">
      <div className="iu-grid-cols-lg-5 ic-container--narrow-md ic-container iu-mb-500">
        <h2 className="ic-page-footer__heading iu-grid-span-lg-2">
          <span className="iu-color-white">Inera</span>
        </h2>
      </div>
      <div className="iu-grid-cols-lg-12 ic-container--narrow-md ic-container">
        <div className="iu-grid-span-lg-5 iu-color-white ic-text">
          <p>
            Inera skapar förutsättningar för att digitalisera välfärden genom att tillhandahålla en gemensam digital infrastruktur och
            arkitektur.
          </p>
        </div>
        <nav className="iu-grid iu-grid-span-lg-7 iu-grid-cols-3 iu-pl-xxl iu-hide-sm iu-hide-md" aria-label="Sidfot meny">
          <ul className="ic-link-list ic-link-list--nav">
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 1
              </a>
            </li>
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 2
              </a>
            </li>
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 3
              </a>
            </li>
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 4
              </a>
            </li>
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 5
              </a>
            </li>
            <li>
              <a className="ic-link-chevron" href="javascript:void(0)">
                Internal link 6
              </a>
            </li>
            <li>
              <a className="ic-link-chevron ic-link ic-link--external" href="javascript:void(0)">
                External link 1<span aria-hidden="true" className="icon-link-ext"></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div className="ic-page-footer__menu iu-hide-from-lg iu-bg-main">
      <nav className="ic-nav-list" id="mobile-nav" aria-label="Sidfot meny mobil">
        <ul className="ic-nav-list__list">
          <li className="ic-nav-list__item">
            <div className="ic-container--narrow-md iu-px-none">
              <a href="javascript:void(0)">Menu item 1</a>
              <button aria-expanded="false" aria-controls="submenu-0" className="ic-nav-list__expand">
                <span className="iu-sr-only">Visa innehåll för Menu item 1</span>
              </button>
            </div>
            <ul hidden className="ic-nav-list__list" id="submenu-0"></ul>
          </li>
          <li className="ic-nav-list__item">
            <div className="ic-container--narrow-md iu-px-none">
              <a href="javascript:void(0)">Menu item 1</a>
              <button aria-expanded="true" aria-controls="submenu-1" className="ic-nav-list__expand">
                <span className="iu-sr-only">Visa innehåll för Menu item 1</span>
              </button>
            </div>
            <ul className="ic-nav-list__list" id="submenu-1">
              <li className="ic-nav-list__item">
                <div className="iu-px-none ic-container--narrow-md">
                  <a href="javascript:void(0)">Submenu item 1</a>
                </div>
              </li>
              <li className="ic-nav-list__item">
                <div className="iu-px-none ic-container--narrow-md">
                  <a href="javascript:void(0)">Submenu item 2</a>
                </div>
              </li>
              <li className="ic-nav-list__item">
                <div className="iu-px-none ic-container--narrow-md">
                  <a href="javascript:void(0)">Submenu item 3</a>
                </div>
              </li>
            </ul>
          </li>
          <li className="ic-nav-list__item">
            <div className="ic-container--narrow-md iu-px-none">
              <a href="javascript:void(0)">Menu item 1</a>
              <button aria-expanded="false" aria-controls="submenu-2" className="ic-nav-list__expand">
                <span className="iu-sr-only">Visa innehåll för Menu item 1</span>
              </button>
            </div>
            <ul hidden className="ic-nav-list__list" id="submenu-2"></ul>
          </li>
          <li aria-hidden="true">{/* add last shadow element */}</li>
        </ul>
      </nav>
    </div>
    <hr className="line" />
    <div className="">
      <div className="ic-container--narrow-md">
        <ul className="ic-cookie-list ic-link-list ic-link-list--nav iu-fs-200">
          <li>
            <a className="" href="javascript:void(0)">
              Cookiepolicy
            </a>
          </li>
          <li>
            <button type="button">Cookie inställningar</button>
          </li>
        </ul>
      </div>
    </div>
  </footer>
)
