import { render } from '@testing-library/react'
import { ErrorPageActionType } from '../../schema/error.schema'
import { withRouter } from '../../utils/withRouter'
import { ErrorPageAction } from './ErrorPageAction'

it('Should return start link', () => {
  const { container } = render(withRouter(<ErrorPageAction type={ErrorPageActionType.enum.start} />))
  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-link>
        <ids-icon-chevron
          class="ids-icon"
        />
        <a
          href="https://e-tjanster.1177.se/mvk/"
        >
          Till startsidan
        </a>
      </ids-link>
    </div>
  `)
})

it('Should return login link', () => {
  const { container } = render(withRouter(<ErrorPageAction type={ErrorPageActionType.enum.login} />))
  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-link>
        <ids-icon-chevron
          class="ids-icon"
        />
        <a
          href="/"
        >
          Till inloggning
        </a>
      </ids-link>
    </div>
  `)
})

it('Should return 1177 link', () => {
  const { container } = render(withRouter(<ErrorPageAction type={ErrorPageActionType.enum[1177]} />))
  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-link>
        <ids-icon-chevron
          class="ids-icon"
        />
        <a
          href="https://www.1177.se"
        >
          Till 1177
        </a>
        <ids-icon-external
          class="ids-icon"
          slot="append-icon"
        />
      </ids-link>
    </div>
  `)
})
