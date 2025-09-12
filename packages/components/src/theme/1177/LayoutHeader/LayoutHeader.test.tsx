import { render } from '@testing-library/react'
import { LayoutHeader } from './LayoutHeader'

it('Should render links when user is loaded', async () => {
  const links = [
    { id: '1', name: 'Start', url: '/' },
    { id: '2', name: 'Om Mina intyg', url: '/about' },
    { id: '3', name: 'Hjälp', url: '/help' },
  ]
  const { container } = render(<LayoutHeader avatar={undefined} links={links} skipToContent="skip-to-content" />)

  expect(container).toMatchSnapshot()
})
