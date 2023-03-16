import '@inera/ids-core/components/form/error-message/register'
import { IDSInput as IDSInputElement } from '@inera/ids-core/components/form/input/input-element'
import '@inera/ids-core/components/form/input/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSInput = createComponent({
  displayName: 'IDSInput',
  tagName: 'ids-input',
  elementClass: IDSInputElement,
  react: React,
})
