import '@inera/ids-core/components/grid/row/register'
import { IDSRow as IDSRowElement } from '@inera/ids-core/components/grid/row/row-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSRow = createComponent({
  displayName: 'IDSRow',
  tagName: 'ids-row',
  elementClass: IDSRowElement,
  react: React,
})
