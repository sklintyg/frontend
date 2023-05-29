import { IDSMobileMenu as IDSMobileMenuElement } from '@inera/ids-core/components/mobile/menu/mobile-menu-element'
import '@inera/ids-core/components/mobile/menu/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSMobileMenu = createComponent({
  displayName: 'IDSMobileMenu',
  tagName: 'ids-mobile-menu',
  elementClass: IDSMobileMenuElement,
  react: React,
})
