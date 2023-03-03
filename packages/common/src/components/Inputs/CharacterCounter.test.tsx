import { render, screen } from '@testing-library/react'
import React from 'react'
import CharacterCounter from './CharacterCounter'

const TEXT = 'tecken'

const renderComponent = (limit: number | undefined, value: string) => {
  render(
    <>
      <CharacterCounter limit={limit} value={value} />
    </>
  )
}

describe('Character Counter', () => {
  it('should not render text if limit is not set', () => {
    renderComponent(undefined, '')
    expect(screen.queryByText(TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('should not render text if limit is too low', () => {
    renderComponent(35, '')
    expect(screen.queryByText(TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('should not render text if limit is too low', () => {
    renderComponent(30, '')
    expect(screen.queryByText(TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('should not render text if limit is too high', () => {
    renderComponent(1001, '')
    expect(screen.queryByText(TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('should render text if limit is 1000', () => {
    renderComponent(1000, '')
    expect(screen.getByText(TEXT, { exact: false })).toBeInTheDocument()
  })

  it('should render text if limit is less than 1000', () => {
    renderComponent(800, '')
    expect(screen.getByText(TEXT, { exact: false })).toBeInTheDocument()
  })

  it('should correctly count number of chars left', () => {
    renderComponent(800, 'A')
    expect(screen.getByText('799', { exact: false })).toBeInTheDocument()
  })

  it('should correctly count number of chars left', () => {
    renderComponent(500, 'AAA')
    expect(screen.getByText('497', { exact: false })).toBeInTheDocument()
  })

  it('should correctly count number of chars left', () => {
    renderComponent(100, 'AA BB')
    expect(screen.getByText('95', { exact: false })).toBeInTheDocument()
  })

  it('should print the correct text', () => {
    renderComponent(100, 'AA BB')
    expect(screen.getByText('95 av 100 tecken')).toBeInTheDocument()
  })
})
