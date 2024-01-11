import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PageDivider } from './PageDivider'

it('Should render as expected', () => {
  const { container } = render(<PageDivider />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <hr
        class="my-7 border-stone-line"
      />
    </div>
  `)
})
