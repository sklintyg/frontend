import { IDSCheckboxGroup as IDSCheckboxGroupElement } from '@inera/ids-core/components/form/checkbox-group/checkbox-group-element'
import '@inera/ids-core/components/form/checkbox-group/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSCheckboxGroup = createComponent({
  displayName: 'IDSCheckboxGroup',
  tagName: 'ids-checkbox-group',
  elementClass: IDSCheckboxGroupElement,
  react: React,
})
