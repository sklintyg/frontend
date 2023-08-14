import { IDSHeaderMobileItem as IDSHeaderMobileItemElement } from '@inera/ids-core/components/header/navigation/mobile-item/mobile-item-element'
import '@inera/ids-core/components/header/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderMobileItem = createComponent({
  displayName: 'IDSHeaderMobileItem',
  tagName: 'ids-header-mobile-item',
  elementClass: IDSHeaderMobileItemElement,
  react: React,
})
