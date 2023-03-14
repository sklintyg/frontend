import '@inera/ids-core/components/form/error-message/register'
import { IDSRadio as IDSRadioElement } from '@inera/ids-core/components/form/radio/radio-element'
import '@inera/ids-core/components/form/radio/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSRadio = createComponent({
  displayName: 'IDSRadio',
  tagName: 'ids-radio',
  elementClass: IDSRadioElement,
  react: React,
})
