import { IDSBadge as IDSBadgeElement } from '@inera/ids-core/components/badge/badge-element'
import '@inera/ids-core/components/badge/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSBadge = createComponent({
  tagName: 'ids-badge',
  elementClass: IDSBadgeElement,
  react: React,
})
