import { IDSExpandable as IDSExpandableElement } from '@inera/ids-core/components/expandable/expandable-element'
import '@inera/ids-core/components/expandable/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSExpandable = createComponent({
  tagName: 'ids-expandable',
  elementClass: IDSExpandableElement,
  react: React,
})
