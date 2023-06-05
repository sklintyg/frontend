import { IDSMobileMenuItem as IDSMobileMenuItemElement } from '@inera/ids-core/components/mobile/menu/item/mobile-menu-item-element'
import '@inera/ids-core/components/mobile/menu/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSMobileMenuItem = createComponent({
  displayName: 'IDSMobileMenuItem',
  tagName: 'ids-mobile-menu-item',
  elementClass: IDSMobileMenuItemElement,
  react: React,
})
