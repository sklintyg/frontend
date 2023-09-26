import { render } from '@testing-library/react'
import { CertificateCardInfo } from './CertificateCardInfo'

it('Should render correctly', () => {
  const { baseElement } = render(<CertificateCardInfo id="1234" issuer={{ name: 'Adamn', phoneNumber: '1376-076923' }} />)
  expect(baseElement).toMatchSnapshot()
})
