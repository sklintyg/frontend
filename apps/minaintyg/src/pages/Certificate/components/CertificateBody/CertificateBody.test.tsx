import { render } from '@testing-library/react'
import { CertificateBody } from './CertificateBody'

it('Should render html as expected', () => {
  const content = [{ heading: 'Rubrik 1', body: '<p>Test</p>' }]
  const { container } = render(<CertificateBody content={content} />)
  expect(container).toMatchSnapshot()
})

it('Should render table as expected', () => {
  const content = [{ heading: 'Rubrik 1', body: '<table><tbody><tr><td>Test</td></tr></tbody></table>' }]
  const { container } = render(<CertificateBody content={content} />)
  expect(container).toMatchSnapshot()
})

it.each(Array.from({ length: 6 }, (_, index) => `h${index + 1}`))('Should render %s heading as expected', (tag) => {
  const content = [{ heading: 'Rubrik 1', body: `<${tag}>heading</${tag}>` }]
  const { container } = render(<CertificateBody content={content} />)
  expect(container).toMatchSnapshot()
})
