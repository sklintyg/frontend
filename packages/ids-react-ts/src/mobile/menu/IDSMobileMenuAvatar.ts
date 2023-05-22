import { IDSMobileMenuAvatar as IDSMobileMenuAvatarElement } from '@inera/ids-core/components/mobile/menu/avatar/mobile-menu-avatar-element'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSMobileMenuAvatar = createComponent({
  displayName: 'IDSMobileMenuAvatar',
  tagName: 'ids-mobile-menu-avatar',
  elementClass: IDSMobileMenuAvatarElement,
  react: React,
})
