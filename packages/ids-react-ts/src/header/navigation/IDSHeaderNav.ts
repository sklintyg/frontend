import { IDSHeaderNav as IDSHeaderNavElement } from '@inera/ids-core/components/header/navigation/navigation-element'
import '@inera/ids-core/components/header/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderNav = createComponent({
  displayName: 'IDSHeaderNav',
  tagName: 'ids-header-nav',
  elementClass: IDSHeaderNavElement,
  react: React,
})
