import '@inera/ids-core/components/form/error-message/register'
import { IDSRadioGroup as IDSRadioGroupElement } from '@inera/ids-core/components/form/radio/radio-group-element'
import '@inera/ids-core/components/form/radio/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSRadioGroup = createComponent({
  displayName: 'IDSRadioGroup',
  tagName: 'ids-radio-group',
  elementClass: IDSRadioGroupElement,
  react: React,
})
