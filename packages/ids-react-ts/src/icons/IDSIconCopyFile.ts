import { IDSIconCopyFile as IDSIconCopyFileElement } from '@inera/ids-core/components/icons/copy-file/icon-copy-file-element'
import '@inera/ids-core/components/icons/copy-file/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSIconCopyFile = createComponent({
  displayName: 'IDSIconCopyFile',
  tagName: 'ids-icon-copy-file',
  elementClass: IDSIconCopyFileElement,
  react: React,
})
