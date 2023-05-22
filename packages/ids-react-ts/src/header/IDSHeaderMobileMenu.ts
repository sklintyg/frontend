import { IDSHeaderMobileMenu as IDSHeaderMobileMenuElement } from '@inera/ids-core/components/header/mobile-menu/header-mobile-menu-element'
import '@inera/ids-core/components/mobile/menu/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderMobileMenu = createComponent({
  displayName: 'IDSHeaderMobileMenu',
  tagName: 'ids-header-mobile-menu',
  elementClass: IDSHeaderMobileMenuElement,
  react: React,
})
