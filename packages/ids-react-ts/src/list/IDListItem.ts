import { IDSListItem as IDSListItemElement } from '@inera/ids-core/components/list/item/list-item-element'
import '@inera/ids-core/components/list/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSListItem = createComponent({
  displayName: 'IDSListItem',
  tagName: 'ids-list-item',
  elementClass: IDSListItemElement,
  react: React,
})
