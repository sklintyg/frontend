import { IDSIconCalendar } from '@inera/ids-react'
import { render } from '@testing-library/react'
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
