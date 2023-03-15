import '@inera/ids-core/components/form/error-message/register'
import '@inera/ids-core/components/form/select/register'
import { IDSSelect as IDSSelectElement } from '@inera/ids-core/components/form/select/select-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSSelect = createComponent({
  displayName: 'IDSSelect',
  tagName: 'ids-select',
  elementClass: IDSSelectElement,
  react: React,
})
