import { IDSRange as IDSRangeElement } from '@inera/ids-core/components/form/range/range-element'
import '@inera/ids-core/components/form/range/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSRange = createComponent({
  displayName: 'IDSRange',
  tagName: 'ids-range',
  elementClass: IDSRangeElement,
  react: React,
})
