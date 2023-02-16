import { render, screen } from '@testing-library/react'
import React from 'react'
import ListHeader from './ListHeader'

const renderComponent = () => {
  render(
    <>
      <ListHeader icon="icon" title="TITLE" description="DESCRIPTION" />
    </>
  )
}

describe('ListHeader', () => {
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText('TITLE')).toBeInTheDocument()
  })

  it('should render description', () => {
    renderComponent()
    expect(screen.getByText('DESCRIPTION')).toBeInTheDocument()
  })
})
