import { render } from '@testing-library/react'
import { PageHero } from './PageHero'

it('Should render as expected with success icon', () => {
  const { container } = render(
    <PageHero heading="heading" type="success">
      content
    </PageHero>
  )
  expect(container).toMatchSnapshot()
})

it('Should render as expected with attention icon', () => {
  const { container } = render(
    <PageHero heading="heading" type="error">
      content
    </PageHero>
  )
  expect(container).toMatchSnapshot()
})
