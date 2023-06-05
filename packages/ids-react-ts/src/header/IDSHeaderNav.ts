import '@inera/ids-core/components/header/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'
import { IDSHeaderNav as IDSHeaderNavElement } from '@inera/ids-core/components/header/navigation/navigation-element'

export const IDSHeaderNav = createComponent({
  displayName: 'IDSHeaderNav',
  tagName: 'ids-header-nav',
  elementClass: IDSHeaderNavElement,
  react: React,
})
