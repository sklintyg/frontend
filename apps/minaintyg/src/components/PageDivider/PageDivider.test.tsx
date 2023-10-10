import { render } from '@testing-library/react'
import { PageDivider } from './PageDivider'

it('Should render as expected', () => {
  const { container } = render(<PageDivider />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <hr
        class="border-stone-clear my-7"
      />
    </div>
  `)
})
