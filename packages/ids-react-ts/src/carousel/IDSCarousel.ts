import { IDSCarousel as IDSCarouselElement } from '@inera/ids-core/components/carousel/carousel-element'
import '@inera/ids-core/components/carousel/register'
import { createComponent } from '@lit-labs/react'
import React from 'react'

export const IDSCarousel = createComponent({
  tagName: 'ids-carousel',
  elementClass: IDSCarouselElement,
  react: React,
})
