import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InvalidCharactersInfoBox from './InvalidCharactersInfoBox'

const renderComponent = (visible: boolean) => {
  render(<InvalidCharactersInfoBox visible={visible} />)
}

describe('InvalidCharactersInfoBox', () => {
  let modalRoot: HTMLDivElement

  beforeEach(() => {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('should not render when visible is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/Tecken som inte stöds/)).not.toBeInTheDocument()
  })

  it('should render the InfoBox when visible is true', () => {
    renderComponent(true)
    expect(
      screen.getByText(/Tecken som inte stöds \(dold formatering och symboler\) har rensats bort/, { exact: false })
    ).toBeInTheDocument()
  })

  it('should render the "Visa mer information" button when visible is true', () => {
    renderComponent(true)
    expect(screen.getByRole('button', { name: 'Visa mer information' })).toBeInTheDocument()
  })

  it('should open the modal when "Visa mer information" is clicked', async () => {
    renderComponent(true)
    const button = screen.getByRole('button', { name: 'Visa mer information' })
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tecken som inte stöds' })).toBeInTheDocument()
  })

  it('should show the correct modal body text', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByRole('button', { name: 'Visa mer information' }))
    expect(screen.getByText(/När text klistras in omvandlas den till ren text/, { exact: false })).toBeInTheDocument()
  })

  it('should close the modal when "Stäng" is clicked', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByRole('button', { name: 'Visa mer information' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should only show the "Stäng" button in the modal (no Avbryt)', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByRole('button', { name: 'Visa mer information' }))
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stäng' })).toBeInTheDocument()
  })
})
