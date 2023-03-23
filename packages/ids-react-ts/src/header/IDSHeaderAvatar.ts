import { IDSHeaderAvatar as IDSHeaderAvatarElement } from '@inera/ids-core/components/header/avatar/header-avatar-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSHeaderAvatar = createComponent({
  displayName: 'IDSHeaderAvatar',
  tagName: 'ids-header-avatar',
  elementClass: IDSHeaderAvatarElement,
  react: React,
})
