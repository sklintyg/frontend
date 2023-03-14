import { IDSList as IDSListElement } from '@inera/ids-core/components/list/list-element'
import '@inera/ids-core/components/list/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSList = createComponent({
  displayName: 'IDSList',
  tagName: 'ids-list',
  elementClass: IDSListElement,
  react: React,
})
