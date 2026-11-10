import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BannerMessage } from './BannerMessage'

const renderComponent = (html: string) => {
  render(
    <div data-testid="message">
      <BannerMessage html={html} />
    </div>
  )
  return screen.getByTestId('message')
}

describe('BannerMessage', () => {
  it('renders plain text', () => {
    expect(renderComponent('Planerat underhåll i kväll')).toHaveTextContent('Planerat underhåll i kväll')
  })

  it('renders a link as a clickable external link', () => {
    renderComponent('Läs mer <a href="https://example.com/info" target="_blank" rel="noopener noreferrer">här</a>.')
    const link = screen.getByRole('link', { name: 'här' })
    expect(link).toHaveAttribute('href', 'https://example.com/info')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link.innerHTML).toContain('ids-icon-external-link-small')
  })

  it('renders a mailto link', () => {
    renderComponent('<a href="mailto:support@example.com">Kontakta oss</a>')
    expect(screen.getByRole('link', { name: 'Kontakta oss' })).toHaveAttribute('href', 'mailto:support@example.com')
  })

  it('keeps line breaks', () => {
    expect(renderComponent('Rad ett<br>Rad två').innerHTML).toBe('Rad ett<br>Rad två')
  })

  it('removes attributes from line breaks', () => {
    expect(renderComponent('Rad ett<br class="x" style="color: red">Rad två').innerHTML).toBe('Rad ett<br>Rad två')
  })

  it('keeps line breaks inside a link', () => {
    renderComponent('<a href="https://example.com">Rad ett<br>Rad två</a>')
    expect(screen.getByRole('link').innerHTML).toContain('Rad ett<br>Rad två')
  })

  it('removes script tags and their content', () => {
    expect(renderComponent('Text<script>window.hacked = true</script>').innerHTML).toBe('Text')
  })

  it('removes event handler attributes and disallowed tags', () => {
    const html = renderComponent('<a href="https://example.com" onclick="alert(1)">Länk</a><img src="x" onerror="alert(1)">').innerHTML
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('<img')
    expect(screen.getByRole('link', { name: 'Länk' })).toHaveAttribute('href', 'https://example.com')
  })

  // eslint-disable-next-line no-script-url -- the test verifies that javascript: links are removed
  it.each(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', '/relative/path'])(
    'renders the text of a link with a disallowed href %s without a link',
    (href) => {
      expect(renderComponent(`<a href="${href}">Klicka</a>`).innerHTML).toBe('Klicka')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    }
  )

  it('keeps bold, italic and underline without attributes', () => {
    const html =
      '<b style="color: red">fet</b> <i class="x">kursiv</i> <u onclick="alert(1)">under</u> <strong>stark</strong> <em>betonad</em>'
    expect(renderComponent(html).innerHTML).toBe('<b>fet</b> <i>kursiv</i> <u>under</u> <strong>stark</strong> <em>betonad</em>')
  })

  it('keeps formatting inside a link', () => {
    renderComponent('<a href="https://example.com"><b>Viktig</b> länk</a>')
    expect(screen.getByRole('link').innerHTML).toContain('<b>Viktig</b> länk')
  })

  it('removes other tags but keeps their text', () => {
    expect(renderComponent('<div>Första</div><p>Andra <span style="font-size: 40px">stor</span></p>').innerHTML).toBe('FörstaAndra stor')
  })
})
