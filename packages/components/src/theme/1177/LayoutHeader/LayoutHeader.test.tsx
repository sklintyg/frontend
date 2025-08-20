import { render } from '@testing-library/react'
import { LayoutHeader } from './LayoutHeader'

it('Should render links when user is loaded', async () => {
  const { container } = render(<LayoutHeader avatar={undefined} mode="development" skipToContent="skip-to-content" />)

  expect(container).toMatchSnapshot()
})
