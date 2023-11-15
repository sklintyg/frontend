import { IDSIconFilePdf as IDSIconFilePdfElement } from '@inera/ids-core/components/icons/file-pdf/icon-file-pdf-element'
import '@inera/ids-core/components/icons/calendar/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconFilePdf = createComponent({
  displayName: 'IDSIconFilePdf',
  tagName: 'ids-icon-file-pdf',
  elementClass: IDSIconFilePdfElement,
  react: React,
})
