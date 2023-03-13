import { IDSHeaderItem as IDSHeaderItemElement } from '@inera/ids-core/components/header/item/header-item-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderItem = createComponent({
  displayName: 'IDSHeaderItem',
  tagName: 'ids-header-item',
  elementClass: IDSHeaderItemElement,
  react: React,
})
