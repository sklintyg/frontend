import { IDSIconUser as IDSIconUserElement } from '@inera/ids-core/components/icons/user/icon-user-element'
import '@inera/ids-core/components/icons/user/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconUser = createComponent({
  displayName: 'IDSIconUser',
  tagName: 'ids-icon-user',
  elementClass: IDSIconUserElement,
  react: React,
})
