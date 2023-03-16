import '@inera/ids-core/components/form/error-message/register'
import '@inera/ids-core/components/form/select-multiple/register'
import { IDSSelectMultiple as IDSSelectMultipleElement } from '@inera/ids-core/components/form/select-multiple/select-multiple-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSSelectMultiple = createComponent({
  displayName: 'IDSSelectMultiple',
  tagName: 'ids-select-multiple',
  elementClass: IDSSelectMultipleElement,
  react: React,
})
