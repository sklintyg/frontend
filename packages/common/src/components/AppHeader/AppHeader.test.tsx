import React from 'react'
import { render, screen } from '@testing-library/react'
import AppHeader from './AppHeader'
import userImage from '../../images/user-image.svg'

describe('App header', () => {
  it('displays primary items', (): void => {
    render(<AppHeader primaryItems={<p>Test</p>} />)
    expect(screen.getByText(/Test/i)).toBeInTheDocument()
  })

  it('displays secondary items', (): void => {
    render(<AppHeader secondaryItems={[<p>Test test</p>]} />)
    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
  })

  it('displays several primary items', (): void => {
    render(
      <AppHeader
        primaryItems={
          <div>
            <p>Test</p>
            <span>My text</span>
          </div>
        }
      />
    )
    expect(screen.getByText(/Test/i)).toBeInTheDocument()
    expect(screen.getByText(/My text/i)).toBeInTheDocument()
  })

  it('displays several secondary items', (): void => {
    render(<AppHeader secondaryItems={['Testing', 'Test test']} />)
    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
    expect(screen.getByText(/Testing/i)).toBeInTheDocument()
  })

  it('displays primary and secondary items', (): void => {
    render(
      <AppHeader
        primaryItems={
          <div>
            <p>Primary items</p>
            <span>My text</span>
          </div>
        }
        secondaryItems={['Testing', 'Test test']}
      />
    )

    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
    expect(screen.getByText(/Testing/i)).toBeInTheDocument()
    expect(screen.getByText(/Primary items/i)).toBeInTheDocument()
    expect(screen.getByText(/My text/i)).toBeInTheDocument()
  })

  it('displays logo', (): void => {
    render(<AppHeader logo={userImage} alt={'alt text'} />)
    const image = screen.getByAltText(/alt text/i)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'user-image.svg')
  })
})
