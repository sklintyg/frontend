import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificatePreambleText } from './CertificatePreambleText'
import { certificateTextSchema } from '../../../../schema/certificate.schema'

it('Should display preamble text', () => {
  const test = fakerFromSchema(certificateTextSchema)({ PREAMBLE_TEXT: 'text' })
  render(<CertificatePreambleText texts={test} />)
  expect(screen.getByText('text')).toBeInTheDocument()
})

it('Should render null when preambleText is not provided', () => {
  const { container } = render(<CertificatePreambleText />)
  expect(container).toBeEmptyDOMElement()
})
