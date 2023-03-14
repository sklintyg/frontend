import { IDSCheckbox as IDSCheckboxElement } from '@inera/ids-core/components/form/checkbox/checkbox-element'
import '@inera/ids-core/components/form/checkbox/register'
import '@inera/ids-core/components/form/error-message/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSCheckbox = createComponent({
  displayName: 'IDSCheckbox',
  tagName: 'ids-checkbox',
  elementClass: IDSCheckboxElement,
  react: React,
})
