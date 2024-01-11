import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LayoutHeader } from './LayoutHeader'

it('Should render links when user is loaded', async () => {
  const { container } = render(<LayoutHeader mode="development" />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-header
        class="z-40 bg-white print:hidden"
      />
    </div>
  `)
})
