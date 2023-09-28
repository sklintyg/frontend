import { render } from '@testing-library/react'
import { PageDivider } from './PageDivider'

it('Should render as expected', () => {
  const { baseElement } = render(<PageDivider />)
  expect(baseElement).toMatchInlineSnapshot(`
    <body>
      <div>
        <hr
          class="border-stone-clear my-7"
        />
      </div>
    </body>
  `)
})
