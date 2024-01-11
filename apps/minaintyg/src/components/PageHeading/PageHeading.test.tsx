import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PageHeading } from './PageHeading'
import { PageHeadingDescription } from './PageHeadingDescription'

it('Should render correctly', () => {
  const { container } = render(
    <PageHeading heading="Test">
      <PageHeadingDescription>Lorem ipsum</PageHeadingDescription>
    </PageHeading>
  )
  expect(container).toMatchSnapshot()
})
