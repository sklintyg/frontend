import { render } from '@testing-library/react'
import { PageDivider } from './PageDivider'

it('Should render as expected', () => {
  const { container } = render(<PageDivider />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <hr
        class="my-7 border-neutral-90"
      />
    </div>
  `)
})
