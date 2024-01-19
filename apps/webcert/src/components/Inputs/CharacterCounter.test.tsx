import { render, screen } from '@testing-library/react'
import CharacterCounter from './CharacterCounter'

const TEXT = 'tecken'

const renderComponent = (limit: number | undefined, value: string) => {
  render(<CharacterCounter limit={limit} value={value} />)
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

  it('should not render text if limit is too high', () => {
    renderComponent(1001, '')
    expect(screen.queryByText('0 av 1001 tecken')).not.toBeInTheDocument()
  })

  it('should render text if limit is 1000', () => {
    renderComponent(1000, '')
    expect(screen.getByText('0 av 1000 tecken')).toBeInTheDocument()
  })

  it('should render text if limit is less than 1000', () => {
    renderComponent(800, '')
    expect(screen.getByText('0 av 800 tecken')).toBeInTheDocument()
  })

  it('should correctly count number of chars left with A', () => {
    renderComponent(800, 'A')
    expect(screen.getByText('1 av 800 tecken')).toBeInTheDocument()
  })

  it('should correctly count number of chars left with AAA', () => {
    renderComponent(500, 'AAA')
    expect(screen.getByText('3 av 500 tecken')).toBeInTheDocument()
  })

  it('should correctly count number of chars left', () => {
    renderComponent(100, '')
    expect(screen.getByText('0 av 100 tecken')).toBeInTheDocument()
  })

  it('should print the correct text', () => {
    renderComponent(100, 'AA BB')
    expect(screen.getByText('5 av 100 tecken')).toBeInTheDocument()
  })
})
