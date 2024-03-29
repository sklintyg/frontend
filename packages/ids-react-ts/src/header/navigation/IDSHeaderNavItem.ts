import { IDSHeaderNavItem as IDSHeaderNavItemElement } from '@inera/ids-core/components/header/navigation/item/navigation-item-element'
import '@inera/ids-core/components/header/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderNavItem = createComponent({
  displayName: 'IDSHeaderNavItem',
  tagName: 'ids-header-nav-item',
  elementClass: IDSHeaderNavItemElement,
  react: React,
})
