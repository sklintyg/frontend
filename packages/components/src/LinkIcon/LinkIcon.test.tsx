import { IDSIconCalendar } from '@frontend/ids-react-ts'
import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LinkIcon } from './LinkIcon'

it('Should render as expected', () => {
  const { container } = render(<LinkIcon icon={IDSIconCalendar} />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="ids-link__icon"
      >
        <ids-icon-calendar
          class="ids-icon"
        />
      </span>
    </div>
  `)
})
