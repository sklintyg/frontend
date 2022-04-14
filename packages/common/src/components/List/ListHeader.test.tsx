import React from 'react'
import { render, screen } from '@testing-library/react'
import ListHeader from './ListHeader'

const renderComponent = () => {
  render(
    <>
      <ListHeader title="TITLE" description="DESCRIPTION" />
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
