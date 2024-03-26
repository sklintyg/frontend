import { render } from '@testing-library/react'
import { SaveCertificateWarningDialog } from './SaveCertificateWarningDialog'

it('Should render as expected', () => {
  const { container } = render(
    <SaveCertificateWarningDialog open onOpenChange={vi.fn()}>
      Test
    </SaveCertificateWarningDialog>
  )
  expect(container).toMatchSnapshot()
})
