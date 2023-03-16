import '@inera/ids-core/components/form/error-message/register'
import '@inera/ids-core/components/form/textarea/register'
import { IDSTextarea as IDSTextareaElement } from '@inera/ids-core/components/form/textarea/textarea-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSTextarea = createComponent({
  displayName: 'IDSTextarea',
  tagName: 'ids-textarea',
  elementClass: IDSTextareaElement,
  react: React,
})
